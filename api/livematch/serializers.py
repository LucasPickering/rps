from enum import Enum
from rest_framework import serializers

from core.util import MatchOutcome, Move, register
from .models import LivePlayerMatch


# This file is pretty jank. Sorry.


_CLIENT_MSG_SERIALIZERS = {}


class ClientMessageType(Enum):
    READY = "ready"
    MOVE = "move"


def register_msg(name):
    return register(_CLIENT_MSG_SERIALIZERS, name.value, field="_TYPE")


def get_client_msg_serializer(serializer_type):
    return _CLIENT_MSG_SERIALIZERS[serializer_type]


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class OpponentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username")
    is_connected = serializers.SerializerMethodField()
    is_ready = serializers.BooleanField()

    class Meta:
        model = LivePlayerMatch
        fields = ("username", "is_connected", "is_ready")

    def get_is_connected(self, obj):
        return obj.connections > 0


class LiveGameSummarySerializer(serializers.Serializer):
    self_move = serializers.SerializerMethodField()
    opponent_move = serializers.SerializerMethodField()
    outcome = serializers.SerializerMethodField()

    def __init__(self, live_game, *args, **kwargs):
        print(live_game)
        try:
            player_user = kwargs["context"]["player_user"]
        except KeyError:
            raise RuntimeError("Expected a context with a 'player_user' field")

        # Get the player and opponent objects
        self.self_obj, self.opponent_obj = live_game.get_self_and_opponent_objs(
            player_user
        )
        if not self.self_obj:
            raise RuntimeError(
                "Cannot get state for player that is not in game"
            )
        super().__init__(live_game, *args, **kwargs)

    def get_self_move(self, obj):
        return self.self_obj.move

    def get_opponent_move(self, obj):
        return self.opponent_obj.move

    def get_outcome(self, obj):
        return Move.get_outcome(
            self.self_obj.move, self.opponent_obj.move
        ).value


class LiveMatchPlayerStateSerializer(serializers.Serializer):
    """
    Serializes a LiveMatch into a current state summary FOR A SINGLE PLAYER.
    This expects two arguments: a LiveMatch, and a User. Creates a dict
    representing the current match state to be sent to that user.
    """

    best_of = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()
    is_ready = serializers.SerializerMethodField()
    selected_move = serializers.SerializerMethodField()
    games = serializers.SerializerMethodField()
    match_outcome = serializers.SerializerMethodField()

    def __init__(self, live_match, *args, **kwargs):
        try:
            player_user = kwargs["context"]["player_user"]
        except KeyError:
            raise RuntimeError("Expected a context with a 'player_user' field")

        # Get the player and opponent objects
        self.self_obj, self.opponent_obj = live_match.get_self_and_opponent_objs(
            player_user
        )
        if not self.self_obj:
            raise RuntimeError(
                "Cannot get state for player that is not in match"
            )
        super().__init__(live_match, *args, **kwargs)

    def get_best_of(self, obj):
        return obj.best_of

    def get_opponent(self, obj):
        return OpponentSerializer(self.opponent_obj).data

    def get_is_ready(self, obj):
        return self.self_obj.is_ready

    def get_selected_move(self, obj):
        return self.self_obj.move

    def get_games(self, obj):
        return [
            LiveGameSummarySerializer(game, context=self.context).data
            for game in obj.games.all()
        ]

    def get_match_outcome(self, obj):
        if obj.is_match_complete:
            return (
                MatchOutcome.WIN.value
                if obj.permanent_match.winner == self.self_obj.user
                else MatchOutcome.LOSS.value
            )
        return None


class ClientMessageSerializer(serializers.Serializer):
    type = serializers.CharField()

    def __init__(self, data={}, *args, **kwargs):
        data["type"] = self._TYPE
        super().__init__(data=data, *args, **kwargs)


@register_msg(ClientMessageType.READY)
class ClientMessageReadySerializer(ClientMessageSerializer):
    pass


@register_msg(ClientMessageType.MOVE)
class ClientMessageMoveSerializer(ClientMessageSerializer):
    move = serializers.CharField()
