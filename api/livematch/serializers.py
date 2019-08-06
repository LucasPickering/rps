from enum import Enum
from rest_framework import serializers

from core import util


_SERIALIZERS = {}


class ClientMessageType(Enum):
    GAME_JOINED = "game_joined"
    MOVE = "move"


def register_msg(name):
    return util.register(_SERIALIZERS, name, field="_TYPE")


def get_serializer(serializer_type):
    return _SERIALIZERS[serializer_type]


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class LiveMatchStateMessageSerializer(serializers.Serializers):
    best_of = serializers.IntegerField()
    opponent_name = serializers.CharField()
    game_in_progress = serializers.BooleanField()
    selected_move = serializers.CharField()
    game_log = serializers.CharField(many=True)
    match_outcome = serializers.CharField()


class ClientMessageSerializer(serializers.Serializer):
    type = serializers.CharField()

    def __init__(self, data={}, *args, **kwargs):
        data["type"] = self._TYPE
        super().__init__(data, *args, **kwargs)


@register_msg(ClientMessageType.MOVE)
class ClientMessageMoveSerializer(ClientMessageSerializer):
    move = serializers.CharField()
