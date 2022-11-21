import uuid
from enum import Enum

LIVEMATCH_ID_LENGTH = 7  # In hex characters


class DbEnum(Enum):
    @classmethod
    def choices(cls):
        return tuple((e.value, e.value) for e in cls)


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
    def is_valid_move(move, extended):
        valid_moves = (
            set(m.value for m in Move)
            if extended
            else {Move.ROCK.value, Move.PAPER.value, Move.SCISSORS.value}
        )
        return move in valid_moves

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


def get_livematch_id():
    return uuid.uuid4().hex[:LIVEMATCH_ID_LENGTH]


def register(registry, *names):
    def inner(cls):
        for name in names:
            if name in registry:
                raise ValueError(
                    "Cannot register '{}' under '{}'."
                    " '{}' is already registered under that name.".format(
                        cls, name, registry[name]
                    )
                )
            registry[name] = cls
        return cls

    return inner


def avg(nums, strict=True):
    """
    Compute the average of the given list of numbers

    Arguments:
        nums {int|float} -- numbers

    Keyword Arguments:
        strict {bool} -- if True, throw an error for empty list,
        if false return 0 (default: {True})

    Raises:
        e: ZeroDivisionError if list is empty

    Returns:
        float -- average of list
    """
    try:
        return sum(nums) / len(nums)
    except ZeroDivisionError as e:
        if strict:
            raise e
        return 0.0
