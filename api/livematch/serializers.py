from rest_framework import serializers

from core import util


_MESSAGE_SERIALIZERS = {}
_ERROR_SERIALIZERS = {}


def register_msg(name):
    return util.register(_MESSAGE_SERIALIZERS, name, field="_TYPE")


def register_error(name):
    return util.register(_ERROR_SERIALIZERS, name, field="_TYPE")


def get_msg_serializer(serializer_type):
    return _MESSAGE_SERIALIZERS[serializer_type]


class MessageSerializer(serializers.Serializer):
    msg_type = serializers.CharField()
    is_error = serializers.BooleanField(default=False)

    def __init__(self, data={}, *args, **kwargs):
        data["msg_type"] = self._TYPE
        super().__init__(data, *args, **kwargs)


class ErrorSerializer(MessageSerializer):
    is_error = serializers.BooleanField(default=True)


# ===== SUCCESS MESSAGES =====


@register_msg("game_joined")
class MessageGameJoinedSerializer(MessageSerializer):
    pass


@register_msg("move")
class MessageMoveSerializer(MessageSerializer):
    data = serializers.CharField()


# ===== ERROR MESSAGES =====


@register_error("invalid_uuid")
class ErrorInvalidUuidSerializer(ErrorSerializer):
    pass


@register_error("game_full")
class ErrorGameFullSerializer(ErrorSerializer):
    pass


@register_error("already_in_game")
class ErrorAlreadyInGameSerializer(ErrorSerializer):
    pass


@register_error("malformed_message")
class ErrorMalformedMessageSerializer(ErrorSerializer):
    message = serializers.CharField()
