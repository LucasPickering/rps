import logging
from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer
from django.conf import settings
from django.db import transaction

from .models import LiveMatch
from .serializers import (
    get_client_msg_serializer,
    ErrorSerializer,
    ClientMessageType,
    LiveMatchStateSerializer,
)
from .error import ClientError, ClientErrorType

logger = logging.getLogger(settings.RPS_LOGGER_NAME)


def validate_content(content):
    # Get the message type
    try:
        msg_type = content["type"]
    except KeyError:
        raise ClientError(
            ClientErrorType.MALFORMED_MESSAGE, detail="Missing type"
        )

    # Look up the correct serializer for this type and try to deserialize
    serializer_cls = get_client_msg_serializer(msg_type)
    serializer = serializer_cls(data=content)
    if not serializer.is_valid():
        raise ClientError(
            ClientErrorType.MALFORMED_MESSAGE, detail=serializer.errors
        )
    return serializer.validated_data


class MatchConsumer(JsonWebsocketConsumer):
    """
    In general, this consumer should accept all connection and keep them open.
    Anything that goes wrong in terms of input/state/etc. should be reported
    as an error over the socket, but still left open. An actual socket error
    should indicate a bug, network error, or the like.
    """

    @property
    def channel_group_name(self):
        return f"match_{self.match_id}"

    def trigger_client_update(self):
        """
        Initiates an state update to all clients. This doesn't actuall send
        the update messages - it just triggers a group message over the Channel
        layer, which will cause an update in every consumer (including this one)
        """
        # Send the message to other consumers in the group
        async_to_sync(self.channel_layer.group_send)(
            self.channel_group_name, {"type": "match.update"}
        )

    def match_update(self, event):
        """
        Listener for match updates from other consumers on this match. Should
        only be called by Django Channels. Triggered indirectly via
        trigger_client_update

        Arguments:
            event {dict} -- The event received from the sender
        """
        # No need to lock for read-only operation
        live_match = self.get_match(lock=False)
        self.send_json(
            LiveMatchStateSerializer(
                live_match, context={"player": self.player}
            ).data
        )

    def handle_error(self, error):
        """
        Processes the given error. An error message is send over the socket,
        but the socket is left open.

        Arguments:
            error {ClientError} -- The error
        """
        self.send_json(ErrorSerializer(error.to_dict()).data)

    def get_match(self, lock=True):
        qs = LiveMatch.objects
        if lock:
            qs = qs.select_for_update()
        return qs.get(id=self.match_id)

    def connect_player(self):
        """
        Tries to add the authenticated player to this match.

        Raises:
            ClientError: If the game is full or this player is already in it
        """

        # Try to join the game
        with transaction.atomic():
            # Get the row and lock it
            try:
                live_match = self.get_match()
            except LiveMatch.NotFound:
                raise ClientError(ClientErrorType.UNKNOWN_MATCH_ID)

            # If the player is already in the game, this will mark them as
            # connected (if they were disconnected). If they were already
            # connected, nothing happens here.
            live_match.player_join(self.player)

            # Join the channel group for all sockets in this match. Make sure
            # we do this BEFORE releasing the lock, to prevent missing
            # messages
            async_to_sync(self.channel_layer.group_add)(
                self.channel_group_name, self.channel_name
            )

        self.trigger_client_update()

    def process_msg(self, msg):
        msg_type = msg["type"]

        valid_msg_types = set(cmt.value for cmt in ClientMessageType)
        if msg_type not in valid_msg_types:
            raise ClientError(
                ClientErrorType.MALFORMED_MESSAGE,
                f"Unknown message type: {msg_type}",
            )

        with transaction.atomic():
            # If live_match doesn't exist, tenemos problemos
            live_match = self.get_match()

            # Make sure this player is allowed to be doing things
            if not live_match.is_participant(self.player):
                raise ClientError(
                    ClientErrorType.NOT_IN_MATCH,
                    "You are not participating in this match",
                )

            if msg_type == ClientMessageType.HEARTBEAT.value:
                live_match.heartbeat(self.player)
            elif msg_type == ClientMessageType.READY.value:
                live_match.ready_up(self.player)
            elif msg_type == ClientMessageType.MOVE.value:
                live_match.apply_move(self.player, msg["move"])
            elif msg_type == ClientMessageType.REMATCH.value:
                live_match.accept_rematch(self.player)

        self.trigger_client_update()

    def connect(self):
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        self.player = self.scope["user"]
        self.accept()
        try:
            logger.info(
                f"Player {self.player} connecting to match {self.match_id}"
            )
            self.connect_player()
        except ClientError as e:
            self.handle_error(e)

    def disconnect_json(self, close_code):
        logger.info(
            f"Player {self.player} disconnecting from match {self.match_id};"
            + f" code={close_code}"
        )
        # Leave the channel group
        async_to_sync(self.channel_layer.group_discard)(
            self.channel_group_name, self.channel_name
        )

    def receive_json(self, content):
        try:
            msg = validate_content(content)
            self.process_msg(msg)
        except ClientError as e:
            self.handle_error(e)
