import json
from channels.generic.websocket import WebsocketConsumer
from django.db import transaction

from core import util
from core.models import LiveMatch

from .message import MessageGameFull, MessageGameJoined, MessageAlreadyInGame


class MatchConsumer(WebsocketConsumer):
    def send_message(self, message):
        self.send(
            text_data=json.dumps(
                {
                    "id": message.ID,
                    "is_error": message.is_error,
                    "body": message.body,
                }
            )
        )

    def add_player(self, user):
        # Try to join the game
        message = None
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
                message = MessageGameFull()
            else:
                if this_player == other_player:
                    # This player is already in the game
                    message = MessageAlreadyInGame()
                else:
                    message = MessageGameJoined()
                    self.update()  # Write to DB

        self.send_message(message)
        if message.is_error:
            # Not joining the game, so close the socket
            self.close()

    def connect(self):
        match_id = self.scope["url_route"]["kwargs"]["match_id"]
        if util.is_uuid(match_id):
            self.accept()
            user = self.scope["user"]

            # Get the row and lock it
            self.live_match = LiveMatch.objects.select_for_update().get_or_create(
                id=match_id
            )

            self.add_player(user)
        else:
            self.close()  # Invalid UUID, no go

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(message)

        self.send(text_data=json.dumps({"message": message}))
