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
    return bool(UUID_RGX.match(s))


def register(registry, name, field=None):
    def inner(cls):
        if name in registry:
            raise ValueError(
                "Cannot register '{}' under '{}'."
                " '{}' is already registered under that name.".format(
                    cls, name, registry[name]
                )
            )
        if field:
            setattr(cls, field, name)
        registry[name] = cls
        return cls

    return inner
