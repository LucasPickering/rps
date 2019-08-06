from .serializers import LiveMatchStateMessageSerializer


class LiveMatchStateMessage:
    def __init__(self, live_match, player):
        self._state = {
            "best_of": live_match.best_of,
            "opponent_name": player.username,  # TODO
            "game_in_progress": live_match.is_game_in_progress,
            "selected_move": None,  # TODO
            "game_log": [],  # TODO
            "match_outcome": None,  # TODO
        }

    def get_serializer(self):
        return LiveMatchStateMessageSerializer(data=self._state)
