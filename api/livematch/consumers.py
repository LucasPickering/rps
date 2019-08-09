from channels.generic.websocket import JsonWebsocketConsumer
from django.db import transaction

from core import util

from .message import LiveMatchStateMessage
from .models import LiveMatch
from .serializers import get_serializer, ErrorSerializer, ClientMessageType
from .error import ClientError, ClientErrorType


class MatchConsumer(JsonWebsocketConsumer):
    def send_data(self, serializer):
        self.send_json(serializer.data)

    def send_match_state(self, live_match):
        msg = LiveMatchStateMessage(live_match=live_match, player=self.player)
        self.send_data(msg.get_serializer())

    def handle_error(self, error):
        """
        Processes the given error. An error message is send over the socket,
        then if the error is marked as fatal, the socket is closed.

        Arguments:
            error {ClientError} -- The error
        """
        self.send_data(ErrorSerializer(error.to_dict()))
        if error.fatal:
            self.close()

    def validate_match_id(self):
        """
        Checks if the match ID from the URL is valid.

        Raises:
            ClientError: If the match ID is invalid
        """
        if not util.is_uuid(self.match_id):
            raise ClientError(ClientErrorType.INVALID_MATCH_ID, fatal=True)

    def validate_user(self):
        if not self.player.is_authenticated:
            raise ClientError(ClientErrorType.NOT_LOGGED_IN, fatal=True)

    def validate_content(self, content):
        # Get the message type
        try:
            msg_type = content["type"]
        except KeyError:
            raise ClientError(
                ClientErrorType.MALFORMED_MESSAGE, detail="Missing type"
            )

        # Look up the correct serializer for this type and try to deserialize
        serializer = get_serializer(msg_type)
        if not serializer.is_valid():
            raise ClientError(
                ClientErrorType.MALFORMED_MESSAGE, detail=serializer.errors
            )
        return serializer.validated_data

    def get_match(self):
        live_match, _ = LiveMatch.objects.select_for_update().get(
            id=self.match_id
        )
        return live_match

    def user_connect(self):
        """
        Tries to add the authenticated user to this match.

        Raises:
            ClientError: If the game is full or this player is already in it
        """

        # Try to join the game
        with transaction.atomic():
            # Get the row and lock it
            live_match, _ = LiveMatch.objects.select_for_update().get_or_create(
                id=self.match_id
            )

            # If the player is already in the game, this will mark them as
            # connected (if they were disconnected). If they were already
            # connected, nothing happens here.
            if not live_match.connect_player(self.player):
                # Get up on outta here with your game hijacking
                raise ClientError(ClientErrorType.GAME_FULL, fatal=True)
            # Player was successfully added - write it to the DB
            live_match.save()

        self.send_match_state(live_match)

    def user_disconnect(self):
        with transaction.atomic():
            try:
                live_match = self.get_match()
            except LiveMatch.DoesNotExist:
                return

            if live_match.disconnect_player(self.player):
                live_match.save()

    def process_msg(self, msg):
        if msg["type"] == ClientMessageType.MOVE:
            with transaction.atomic():
                # If live_match doesn't exist, we have problemos
                live_match = self.get_match()
                live_match.apply_move(self.player, msg["move"])
                if live_match.is_game_complete:
                    live_match.process_complete_game()
                live_match.save()

            self.send_match_state(live_match)

    def connect(self):
        print("connect")
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        self.player = self.scope["user"]
        self.accept()
        try:
            self.validate_user()
            self.validate_match_id()
            self.user_connect()
        except ClientError as e:
            self.handle_error(e)

    def disconnect_json(self, close_code):
        print("disconnect")
        try:
            self.player_disconnect()
        except ClientError as e:
            self.handle_error(e)

    def receive_json(self, content):
        print("receive", content)
        try:
            msg = self.validate_content(content)
            self.process_msg(msg)
        except ClientError as e:
            self.handle_error(e)
