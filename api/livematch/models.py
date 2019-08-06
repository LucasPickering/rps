from django.db import models
from django.contrib.auth.models import User
from django_composite_field import CompositeField

from core.util import Move
from .error import ClientError, ClientErrorType


class PlayerField(CompositeField):
    """
    Re-usable field to de-duplicate the logic around a player.
    """

    # Null here means no player has joined yet
    player = models.ForeignKey(User, on_delete=models.PROTECT)
    is_connected = models.BooleanField(default=False)
    # Null here means game hasn't started or currently waiting for their move
    move = models.CharField(choices=Move.choices(), max_length=20, null=True)


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    start_time = models.DateField(auto_now=True)
    player1 = PlayerField(null=True)
    player2 = PlayerField(null=True)

    @property
    def is_game_in_progress(self):
        return bool(self.player1_move) != bool(self.player2_move)

    @property
    def is_game_complete(self):
        return self.player1_move and self.player1_move

    def connect_player(self, player):
        """
        Adds the given player to this match, if there is a slot open. If the
        player is already in the match, sets the appropriate connected field
        to True. If the game already has two other players, nothing happens.

        Arguments:
            player {User} -- The player (user) to connect

        Returns:
            bool -- True if the player was connected, False if the game is
            already full
        """
        if self.player1_player is None:
            self.player1_player = player
        elif self.player2 is None:
            self.player2 = player

        # If we just added the player, or they were already in the game, mark
        # them as connected.
        if player == self.player1_player:
            self.player1_connected = True
        elif player == self.player2_player:
            self.player2_connected = True
        else:
            return False
        return True

    def disconnect_player(self, player):
        """
        Disconnects the given player from the match. They will remain a player
        in the match, but the connected flag will be set to False.

        Arguments:
            player {User} -- The player (user) to disconnect

        Returns:
            bool -- True if the player was disonnect, False if they aren't in
            the game
        """
        if player == self.player1_player:
            self.player1_connected = False
        elif player == self.player2_player:
            self.player2_connected = False
        else:
            return False
        return True

    def apply_move(self, player, move):
        """
        Applies the given move for the given player.

        Arguments:
            player {User} -- The player to make a move for
            move {string} -- The move to make

        Raises:
            ClientError: If the move is invalid, this player has already moved,
            or they are not in the match
        """
        # TODO validate move string
        if player == self.player1_player:
            if self.player1_move is None:
                self.player1_move = move
            else:
                raise ClientError(
                    ClientErrorType.INVALID_MOVE, "Move already applied"
                )
        elif player == self.player2_player:
            if self.player2_move is None:
                self.player2_move = move
            else:
                raise ClientError(
                    ClientErrorType.INVALID_MOVE, "Move already applied"
                )
        else:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Player not in match"
            )

    def process_complete_game(self):
        if not self.is_game_complete:
            raise RuntimeError("Cannot complete game")

        p1_outcome = Move.get_outcome(self.player1_move, self.player2_move)

        # Clear moves
        self.player1_move = None
        self.player2_move = None
