from enum import Enum


class ClientErrorType(Enum):
    UNKNOWN_MATCH_ID = "unknown_match_id"
    MALFORMED_MESSAGE = "malformed_message"
    NOT_IN_MATCH = "not_in_match"
    INVALID_MOVE = "invalid_move"


class ClientError(Exception):
    def __init__(self, error_type, detail=None):
        super().__init__(error_type, detail)
        self._error_type = error_type
        self._detail = detail

    def to_dict(self):
        return {"error": self._error_type.value, "detail": self._detail}
