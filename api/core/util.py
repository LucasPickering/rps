import re
from enum import Enum

UUID_RGX = re.compile(r"[0-9a-f]{32}")


class DbEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((e.name, e.name) for e in cls)


class Move(DbEnum):
    ROCK = "rock"
    PAPER = "paper"
    SCISSORS = "scissors"
    LIZARD = "lizard"
    SPOCK = "spock"


def is_uuid(s):
    return UUID_RGX.matches(s)
