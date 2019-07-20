import abc


class Message(metaclass=abc.ABCMeta):
    def __init__(self, body=None):
        self._body = body

    @property
    def msg_id(self):
        return self._ID

    @property
    def is_error(self):
        return self._IS_ERROR

    @property
    def body(self):
        return self._body


class MessageGameJoined(Message):
    _ID = "game_joined"
    _IS_ERROR = False


class MessageGameFull(Message):
    _ID = "game_full"
    _IS_ERROR = True


class MessageAlreadyInGame(Message):
    _ID = "already_in_game"
    _IS_ERROR = True
