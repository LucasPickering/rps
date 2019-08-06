from django.db import models
from django.contrib.auth.models import User
from django_composite_field import CompositeField

from core import util
from .error import ClientError, ClientErrorType


class PlayerField(CompositeField):
    """
    Re-usable field to de-duplicate the logic around a player.
    """

    # Null here means no player has joined yet
    player = models.ForeignKey(User, on_delete=models.PROTECT)
    is_connected = models.BooleanField(default=False)
    # Null here means game hasn't started or currently waiting for their move
    move = models.CharField(
        choices=util.Move.choices(), max_length=20, null=True
    )


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    start_time = models.DateField(auto_now=True)
    player1 = PlayerField(null=True)
    player2 = PlayerField(null=True)

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

        Returns:
            bool -- True if the game is now complete, False if still waiting
            for the other player
        """
        # TODO validate move string
        if player == self.player1_player:
            if self.move1 is None:
                self.move1 = move
            else:
                raise ClientError(
                    ClientErrorType.INVALID_MOVE, "Move already applied"
                )
        elif player == self.player2_player:
            if self.move2 is None:
                self.move2 = move
            else:
                raise ClientError(
                    ClientErrorType.INVALID_MOVE, "Move already applied"
                )
        else:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Player not in match"
            )
        return self.move1 and self.move2

    def clear_moves(self):
        self.move1 = None
        self.move2 = None
