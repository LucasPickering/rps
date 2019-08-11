import re
from enum import Enum

UUID_RGX = re.compile(r"[0-9a-f]{32}")


class DbEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((e.name, e.name) for e in cls)


class GameOutcome(Enum):
    WIN = "win"
    LOSS = "loss"
    TIE = "tie"


class Move(DbEnum):
    ROCK = "rock"
    PAPER = "paper"
    SCISSORS = "scissors"
    LIZARD = "lizard"
    SPOCK = "spock"

    @staticmethod
    def get_outcome(move1, move2):
        """
        Gets the outcome of the first move relative to the second

        Arguments:
            move1 {Move} -- The first move
            move2 {Move} -- The second move

        Returns:
            GameOutcome -- Win if first beats second, Loss if second beats
            first, Tie otherwise
        """
        return GameOutcome.TIE  # TODO


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
