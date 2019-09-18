from enum import Enum
from rest_framework import serializers

from core.util import register
from core.serializers import MatchConfigSerializer
from core.models import MatchConfig
from . import models


_CLIENT_MSG_SERIALIZERS = {}


class ClientMessageType(Enum):
    HEARTBEAT = "heartbeat"
    READY = "ready"
    MOVE = "move"
    REMATCH = "rematch"


def register_msg(*names):
    return register(_CLIENT_MSG_SERIALIZERS, *(name.value for name in names))


def get_client_msg_serializer(serializer_type):
    return _CLIENT_MSG_SERIALIZERS[serializer_type]


class ClientMessageSerializer(serializers.Serializer):
    type = serializers.CharField()


@register_msg(
    ClientMessageType.HEARTBEAT,
    ClientMessageType.READY,
    ClientMessageType.REMATCH,
)
class EmptyClientMessageSerializer(ClientMessageSerializer):
    pass


@register_msg(ClientMessageType.MOVE)
class ClientMessageMoveSerializer(ClientMessageSerializer):
    move = serializers.CharField()


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class LivePlayerGameSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(
        source="player", slug_field="username", read_only=True
    )

    class Meta:
        model = models.LivePlayerGame
        fields = ("username", "move")


class LiveGameSerializer(serializers.ModelSerializer):
    winner = serializers.SlugRelatedField(slug_field="username", read_only=True)
    players = LivePlayerGameSerializer(source="liveplayergame_set", many=True)

    class Meta:
        model = models.LiveGame
        exclude = ("id", "match")


class LivePlayerMatchSerializer(serializers.ModelSerializer):
    """
    Expects a "player" field in the context, for the connected player
    """

    username = serializers.CharField(source="player.username")
    move = serializers.SerializerMethodField()

    class Meta:
        model = models.LivePlayerMatch
        fields = ("username", "is_active", "is_ready", "move")

    def get_move(self, obj):
        # Only show the move if it's for this player or the game is over
        can_show = (
            obj.player_id == self.context["player"].id
            or obj.match.is_game_complete
        )
        return obj.move if can_show else None


class LiveMatchStateSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField()
    games = LiveGameSerializer(many=True)
    winner = serializers.SerializerMethodField()
    rematch = serializers.PrimaryKeyRelatedField(read_only=True)
    is_participant = serializers.SerializerMethodField()

    class Meta:
        model = models.LiveMatch
        fields = ("players", "games", "winner", "rematch", "is_participant")

    def get_players(self, obj):
        # Has to be a method to forward the context
        return LivePlayerMatchSerializer(
            obj.liveplayermatch_set, many=True, context=self.context
        ).data

    def get_winner(self, obj):
        return obj.permanent_match and obj.permanent_match.winner.username

    def get_is_participant(self, obj):
        return obj.is_participant(self.context["player"])


class LiveMatchSerializer(serializers.ModelSerializer):
    """
    Serializer used to read/write the config fields of a LiveMatch
    """

    config = MatchConfigSerializer()

    class Meta:
        model = models.LiveMatch
        fields = ("id", "config")
        read_only_fields = ("id",)

    def create(self, validated_data):
        config_data = validated_data.pop("config")
        config = MatchConfig.objects.create(**config_data)
        return models.LiveMatch.objects.create(config=config)
