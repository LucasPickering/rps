from rest_framework import serializers

from core import util


_SERIALIZERS = {}


def register_msg(name):
    return util.register(_SERIALIZERS, name, field="_TYPE")


def register_error(name):
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


@register_msg("game_joined")
class MessageGameJoinedSerializer(MessageSerializer):
    pass


@register_msg("move")
class MessageMoveSerializer(MessageSerializer):
    data = serializers.CharField()
