from django.db import models
from django.contrib.auth.models import User

from core import util


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    start_time = models.DateField(auto_now=True)
    player1 = models.OneToOneField(
        User, null=True, on_delete=models.PROTECT, related_name="game_as_p1"
    )
    player2 = models.OneToOneField(
        User, null=True, on_delete=models.PROTECT, related_name="game_as_p2"
    )
    move1 = models.CharField(
        choices=util.Move.choices(), max_length=20, null=True
    )
    move2 = models.CharField(
        choices=util.Move.choices(), max_length=20, null=True
    )

    def is_player_in_game(self, player):
        return self.player1 == player or self.player2 == player

    def add_player(self, player):
        """
        Adds the given player to this match, if there is a slot open. If not,
        nothing happens.

        Arguments:
            player {User} -- The player (user) to add

        Returns:
            bool -- True if the player was added, False if the game is already
            full
        """
        if self.player1 is None:
            self.player1 = player
        elif self.player2 is None:
            self.player2 = player
        else:
            return False
        return True

    def apply_move(self, player, move):
        if player == self.player1:
            if self.move1 is None:
                self.move1 = move
            else:
                raise ValueError("Move already applied")
        elif player == self.player2:
            if self.move2 is None:
                self.move2 = move
            else:
                raise ValueError("Move already applied")
        else:
            raise ValueError("Player not in match")

    def clear_moves(self):
        self.move1 = None
        self.move2 = None
