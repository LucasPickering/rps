import json
from channels.generic.websocket import WebsocketConsumer
from enum import Enum

from core import util
from core.models import LiveMatch


class MessageId(Enum):
    GAME_FULL = "game_full"
    GAME_JOINED = "game_joined"


class MatchConsumer(WebsocketConsumer):
    def send_json(self, data, *args, **kwargs):
        self.send(*args, text_data=json.dumps({data}), **kwargs)

    def connect(self):
        match_id = self.scope["url_route"]["kwargs"]["match_id"]
        if util.is_uuid(match_id):
            self.accept()
            user = self.scope["user"]

            # TODO row locking
            self.live_match = LiveMatch.objects.get_or_create(id=match_id)

            # Check if there is a slot available in the match
            if self.live_match.player1 is None:
                self.live_match.player1 = user
            elif self.live_match.player2 is None:
                self.live_match.player2 = user
            else:
                # Already taken, locked out
                self.send_json({"id": MessageId.GAME_FULL})
                self.close()
            self.live_match.update()  # Write to DB
            # TODO release lock
            self.send_json({"id": MessageId.GAME_JOINED})
        else:
            self.close()  # Invalid UUID, no go

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]
        print(message)

        self.send(text_data=json.dumps({"message": message}))
