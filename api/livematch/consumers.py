from channels.generic.websocket import JsonWebsocketConsumer
from django.db import transaction

from core import util

from .models import LiveMatch
from .serializers import (
    get_msg_serializer,
    ErrorAlreadyInGameSerializer,
    ErrorInvalidUuidSerializer,
    ErrorGameFullSerializer,
    ErrorMalformedMessageSerializer,
    MessageGameJoinedSerializer,
)


class MatchConsumer(JsonWebsocketConsumer):
    def send_data(self, serializer):
        self.send_json(serializer.data)

    def user_join(self):
        """
        Tries to add the authenticated user to this match.

        Arguments:

        Returns:
            bool -- True if the join was successful, False if there was an error
        """

        # Try to join the game
        serializer = None
        with transaction.atomic():
            # Get the row and lock it
            live_match, _ = LiveMatch.objects.select_for_update().get_or_create(
                id=self.match_id
            )
            this_player = None
            other_player = None
            # Check if there is a slot available in the match
            if live_match.player1 is None:
                this_player = live_match.player1 = self.user
                other_player = live_match.player2
            elif live_match.player2 is None:
                this_player = live_match.player2 = self.user
                other_player = live_match.player1

            if this_player is None:
                # Neither slot was open
                serializer = ErrorGameFullSerializer()
            else:
                if this_player == other_player:
                    # This player is already in the game
                    serializer = ErrorAlreadyInGameSerializer()
                else:
                    serializer = MessageGameJoinedSerializer()
                    live_match.update()  # Write to DB

        self.send_data(serializer)
        return serializer.data["is_error"]

    def connect(self):
        self.accept()
        self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
        if util.is_uuid(self.match_id):
            self.user = self.scope["user"]

            if not self.user_join():
                self.close()
        else:
            self.send_data(ErrorInvalidUuidSerializer())
            self.close()  # Invalid UUID, no go

    def disconnect_json(self, close_code):
        pass

    def receive_json(self, content):
        try:
            msg_type = content["type"]
        except KeyError:
            self.send_data(
                ErrorMalformedMessageSerializer({"message": "Missing type"})
            )
            return

        serializer = get_msg_serializer(msg_type)
        if not serializer.is_valid():
            return

        data = serializer.data
        print(data)
