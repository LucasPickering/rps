from enum import Enum
from rest_framework import serializers

from core import util


_SERIALIZERS = {}


class MessageType(Enum):
    GAME_JOINED = "game_joined"
    MOVE = "move"


def register_msg(name):
    return util.register(_SERIALIZERS, name, field="_TYPE")


def get_serializer(serializer_type):
    return _SERIALIZERS[serializer_type]


class ErrorSerializer(serializers.Serializer):
    error = serializers.CharField()
    detail = serializers.CharField()


class MessageSerializer(serializers.Serializer):
    type = serializers.CharField()

    def __init__(self, data={}, *args, **kwargs):
        data["type"] = self._TYPE
        super().__init__(data, *args, **kwargs)


@register_msg(MessageType.GAME_JOINED)
class MessageGameJoinedSerializer(MessageSerializer):
    pass


@register_msg(MessageType.MOVE)
class MessageMoveSerializer(MessageSerializer):
    move = serializers.CharField()
