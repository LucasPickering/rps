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

    # Look up the correct serializer for this type
    try:
        serializer_cls = get_client_msg_serializer(msg_type)
    except KeyError:
        raise ClientError(
            ClientErrorType.MALFORMED_MESSAGE,
            f"Unknown message type: {msg_type}",
        )

    # Deserialize the message
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

    def match_update(self, event=None):
        """
        Listener for match updates from other consumers on this match. Can be
        called directly to send the match state to only the connected player.
        Also called by Django Channels, when triggered by trigger_client_update.

        Arguments:
            event {dict} -- The event received from the sender
        """
        # No need to lock for read-only operation
        live_match = self.get_match(lock=False)
        data = LiveMatchStateSerializer(
            live_match, context={"player": self.player}
        ).data
        self.send_json(data)

    def get_match(self, lock=True):
        qs = LiveMatch.objects
        if lock:
            qs = qs.select_for_update()
        return qs.get(id=self.match_id)

    def process_msg(self, msg):
        """
        Processes the given message and performs the necessary model actions.
        Assumes the message has already been completely validated.

        Arguments:
            msg {dict} -- validated message

        Raises:
            ClientError: for any possible state error
        """

        msg_type = msg["type"]

        with transaction.atomic():
            # Get the row and lock it
            try:
                live_match = self.get_match()
            except LiveMatch.NotFound:
                raise ClientError(ClientErrorType.UNKNOWN_MATCH_ID)

            if msg_type == ClientMessageType.JOIN.value:
                # If the player is already in the game, this will update
                # their last_activity. If the join is invalid, an error
                # will be raised.
                live_match.player_join(self.player)

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
        # Join the channel group for all sockets in this match
        async_to_sync(self.channel_layer.group_add)(
            self.channel_group_name, self.channel_name
        )
        self.match_update()  # Send the match state to the user

        logger.info(f"Player {self.player} connected to match {self.match_id}")

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
            self.send_json(ErrorSerializer(e.to_dict()).data)
