from channels.generic.websocket import JsonWebsocketConsumer
from django.db import transaction

from core import util

from .models import LiveMatch
from .serializers import (
    get_serializer,
    ErrorSerializer,
    MessageGameJoinedSerializer,
)
from .error import ClientError, ClientErrorType


class MatchConsumer(JsonWebsocketConsumer):
    def send_data(self, serializer):
        self.send_json(serializer.data)

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

    def user_join(self):
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

            # If the player is already in the game, we don't want to do anything
            if not live_match.is_player_in_game(self.user):
                if not live_match.add_player(self.user):
                    # Get up on outta here with your game hijacking
                    raise ClientError(ClientErrorType.GAME_FULL, fatal=True)
                # Player was successfully added - write it to the DB
                live_match.save()

        self.send_data(MessageGameJoinedSerializer())

    def process_content(self, content):
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

        print("Got this data: ", serializer.validated_data)

    def connect(self):
        print("connect")
        self.accept()
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        self.user = self.scope["user"]
        try:
            self.validate_match_id()
            self.user_join()
        except ClientError as e:
            self.handle_error(e)

    def disconnect_json(self, close_code):
        print("disconnect")
        pass

    def receive_json(self, content):
        print("receive", content)
        try:
            self.process_content(content)
        except ClientError as e:
            self.handle_error(e)
