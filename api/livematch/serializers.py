from enum import Enum
from rest_framework import serializers

from core import util


_CLIENT_MSG_SERIALIZERS = {}


class ClientMessageType(Enum):
    MOVE = "move"


def register_msg(name):
    return util.register(_CLIENT_MSG_SERIALIZERS, name.value, field="_TYPE")


def get_client_msg_serializer(serializer_type):
    return _CLIENT_MSG_SERIALIZERS[serializer_type]


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class OpponentSerializer(serializers.Serializer):
    name = serializers.CharField()
    is_connected = serializers.BooleanField()


class LiveGameSummarySerializer(serializers.Serializer):
    self_move = serializers.CharField()
    opponent_move = serializers.CharField()
    outcome = serializers.CharField()


class LiveMatchStateSerializer(serializers.Serializer):
    best_of = serializers.IntegerField()
    opponent = OpponentSerializer()
    is_game_in_progress = serializers.BooleanField()
    selected_move = serializers.CharField()
    games = LiveGameSummarySerializer(many=True)
    match_outcome = serializers.CharField()


class ClientMessageSerializer(serializers.Serializer):
    type = serializers.CharField()

    def __init__(self, data={}, *args, **kwargs):
        data["type"] = self._TYPE
        super().__init__(data=data, *args, **kwargs)


@register_msg(ClientMessageType.MOVE)
class ClientMessageMoveSerializer(ClientMessageSerializer):
    move = serializers.CharField()
