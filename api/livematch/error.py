from enum import Enum


class ClientErrorType(Enum):
    INVALID_MATCH_ID = "invalid_match_id"
    NOT_LOGGED_IN = "not_logged_in"
    GAME_FULL = "game_full"
    MALFORMED_MESSAGE = "malformed_message"
    INVALID_MOVE = "invalid_move"


class ClientError(Exception):
    def __init__(self, error_type, detail=None, fatal=False):
        super().__init__(error_type, detail)
        self._error_type = error_type
        self._detail = detail
        self._fatal = fatal

    @property
    def fatal(self):
        return self._fatal

    def to_dict(self):
        return {"error": self._error_type.value, "detail": self._detail}
