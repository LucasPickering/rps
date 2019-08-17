import re
from enum import Enum

UUID_RGX = re.compile(r"[0-9a-f]{32}")


class DbEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((e.value, e.value) for e in cls)


class GameOutcome(Enum):
    WIN = "win"
    LOSS = "loss"
    TIE = "tie"


class MatchOutcome(Enum):
    WIN = "win"
    LOSS = "loss"


class Move(DbEnum):
    ROCK = "rock"
    PAPER = "paper"
    SCISSORS = "scissors"
    LIZARD = "lizard"
    SPOCK = "spock"

    @staticmethod
    def is_valid_move(move):
        return move in set(m.value for m in Move)

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
        if move2 in _BEATS[move1]:
            return GameOutcome.WIN
        if move1 in _BEATS[move2]:
            return GameOutcome.LOSS
        return GameOutcome.TIE


_BEATS = {
    Move.ROCK.value: {Move.SCISSORS.value, Move.LIZARD.value},
    Move.PAPER.value: {Move.ROCK.value, Move.SPOCK.value},
    Move.SCISSORS.value: {Move.PAPER.value, Move.LIZARD.value},
    Move.LIZARD.value: {Move.PAPER.value, Move.SPOCK.value},
    Move.SPOCK.value: {Move.ROCK.value, Move.SCISSORS.value},
}


def get_win_target(best_of):
    """
    Gets the number of wins needed to win a match with the given best-of.

    Arguments:
        best_of {number} -- the max number of (non-tie) games in a match

    Returns:
        number -- the number of game wins needed to win the match
    """
    return (best_of // 2) + 1


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
