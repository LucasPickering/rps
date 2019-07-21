from channels.generic.websocket import JsonWebsocketConsumer
from django.db import transaction

from core import util
from core.models import LiveMatch

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

    def join_player(self, user):
        """
        Tries to add the given player to this match.

        Arguments:
            user {User} -- The user to add

        Returns:
            bool -- True if the join was successful, False if there was an error
        """

        # Try to join the game
        serializer = None
        with transaction.atomic():
            this_player = None
            other_player = None
            # Check if there is a slot available in the match
            if self.player1 is None:
                this_player = self.player1 = user
                other_player = self.player2
            elif self.player2 is None:
                this_player = self.player2 = user
                other_player = self.player1

            if this_player is None:
                # Neither slot was open
                serializer = ErrorGameFullSerializer()
            else:
                if this_player == other_player:
                    # This player is already in the game
                    serializer = ErrorAlreadyInGameSerializer()
                else:
                    serializer = MessageGameJoinedSerializer()
                    self.update()  # Write to DB

        self.send_data(serializer)
        return serializer.data["is_error"]

    def connect(self):
        self.accept()
        match_id = self.scope["url_route"]["kwargs"]["match_id"]
        if util.is_uuid(match_id):
            user = self.scope["user"]

            # Get the row and lock it
            self.live_match = LiveMatch.objects.select_for_update().get_or_create(
                id=match_id
            )

            if not self.join_player(user):
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
