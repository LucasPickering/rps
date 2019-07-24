from enum import Enum


class ClientErrorType(Enum):
    INVALID_MATCH_ID = "invalid_match_id"
    GAME_FULL = "game_full"
    MALFORMED_MESSAGE = "malformed_message"


class ClientError(Exception):
    def __init__(self, error_type, detail=None, fatal=False):
        super().__init__(error_type, detail)
        self._error_type = error_type
        self._detail = detail
        self._fatal = fatal

    @property
    def fatal(self):
        return self._fatal

    def __dict__(self):
        return {"error": self._error_type, "detail": self._detail}
