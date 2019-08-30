from enum import Enum
from rest_framework import serializers

from core.util import MatchOutcome, Move, register
from .models import LivePlayerMatch


# This file is pretty jank. Sorry.


_CLIENT_MSG_SERIALIZERS = {}


class ClientMessageType(Enum):
    HEARTBEAT = "heartbeat"
    READY = "ready"
    MOVE = "move"


def register_msg(*names):
    return register(_CLIENT_MSG_SERIALIZERS, *(name.value for name in names))


def get_client_msg_serializer(serializer_type):
    return _CLIENT_MSG_SERIALIZERS[serializer_type]


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class OpponentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="player.username")
    is_active = serializers.BooleanField()
    is_ready = serializers.BooleanField()

    class Meta:
        model = LivePlayerMatch
        fields = ("username", "is_active", "is_ready")


class LiveGameSummarySerializer(serializers.Serializer):
    self_move = serializers.SerializerMethodField()
    opponent_move = serializers.SerializerMethodField()
    outcome = serializers.SerializerMethodField()

    def __init__(self, live_game, *args, **kwargs):
        try:
            player = kwargs["context"]["player"]
        except KeyError:
            raise RuntimeError("Expected a context with a 'player' field")

        # Get the player and opponent objects
        self.self_obj, self.opponent_obj = live_game.get_player_games(player)
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
    This expects two arguments: a LiveMatch, and a Player. Creates a dict
    representing the current match state to be sent to that player.
    """

    best_of = serializers.SerializerMethodField()
    opponent = serializers.SerializerMethodField()
    is_ready = serializers.SerializerMethodField()
    selected_move = serializers.SerializerMethodField()
    games = serializers.SerializerMethodField()
    match_outcome = serializers.SerializerMethodField()

    def __init__(self, live_match, *args, **kwargs):
        try:
            player = kwargs["context"]["player"]
        except KeyError:
            raise RuntimeError("Expected a context with a 'player' field")

        # Get the player and opponent objects
        self.self_obj, self.opponent_obj = live_match.get_player_matches(player)
        if not self.self_obj:
            raise RuntimeError(
                "Cannot get state for player that is not in match"
            )
        super().__init__(live_match, *args, **kwargs)

    def get_best_of(self, obj):
        return obj.best_of

    def get_opponent(self, obj):
        return (
            OpponentSerializer(self.opponent_obj).data
            if self.opponent_obj
            else None
        )

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
                if obj.permanent_match.winner == self.self_obj.player
                else MatchOutcome.LOSS.value
            )
        return None


class ClientMessageSerializer(serializers.Serializer):
    type = serializers.CharField()


@register_msg(ClientMessageType.HEARTBEAT, ClientMessageType.READY)
class EmptyClientMessageSerializer(ClientMessageSerializer):
    pass


@register_msg(ClientMessageType.MOVE)
class ClientMessageMoveSerializer(ClientMessageSerializer):
    move = serializers.CharField()
