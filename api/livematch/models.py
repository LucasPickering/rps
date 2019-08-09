from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.db.models import signals
from django.dispatch import receiver

from core.util import Move
from .error import ClientError, ClientErrorType


class LiveMatchPlayer(models.Model):
    """
    Holds the data for one player in a live match. THIS TABLE SHOULD NEVER BE
    MODIFIED DIRECTLY - ONLY VIA LiveMatch. If you have a lock on a LiveMatch
    row, you own can considered its LiveMatchPlayers locked.
    """

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    # There's potential for bugs here, if the server goes down while a user
    # is connected. Maybe we should just wipe the LiveMatch table on startup.
    connections = models.PositiveSmallIntegerField(default=0)
    move = models.CharField(choices=Move.choices(), max_length=20, blank=True)


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    start_time = models.DateField(auto_now=True)
    best_of = models.PositiveSmallIntegerField(default=5)
    # Null here means no player has joined yet
    player1 = models.OneToOneField(
        LiveMatchPlayer,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        related_name="match_as_p1",
    )
    player2 = models.OneToOneField(
        LiveMatchPlayer,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        related_name="match_as_p2",
    )

    @receiver(signals.pre_save)
    def pre_save_handler(sender, instance, *args, **kwargs):
        instance.full_clean()

    def clean(self):
        super().clean()
        if (
            self.player1
            and self.player2
            and self.player1.user == self.player2.user
        ):
            raise ValidationError(
                f"User {self.player1.user} is both player1 and player2"
            )

    @property
    def is_game_in_progress(self):
        return (
            self.player1
            and self.player2
            and bool(self.player1.move) != bool(self.player2.move)
        )

    @property
    def is_game_complete(self):
        return (
            self.player1
            and self.player2
            and self.player1.move
            and self.player1.move
        )

    def get_player_and_opponent_objs(self, player_user):
        if self.player1 and player_user == self.player1.user:
            return (self.player1, self.player2)
        if self.player2 and player_user == self.player2.user:
            return (self.player2, self.player1)
        return (None, None)

    def get_player_obj(self, player_user):
        (player_obj, _) = self.get_player_and_opponent_objs(player_user)
        return player_obj

    def get_state_for_player(self, player):
        (player_obj, opponent_obj) = self.get_player_and_opponent_objs(player)

        if not player_obj:
            raise RuntimeError(
                "Cannot get state for player that is not in game"
            )
        return {
            "best_of": self.best_of,
            "opponent_name": opponent_obj.user.username
            if opponent_obj
            else None,
            "opponent_connected": opponent_obj and opponent_obj.connections > 0,
            "game_in_progress": self.is_game_in_progress,
            "selected_move": player_obj.move,
            "game_log": [],  # TODO
            "match_outcome": None,  # TODO
        }

    def connect_player(self, player):
        """
        Adds the given player to this match, if there is a slot open. If the
        player is already in the match, increments the appropriate connections
        field. If the game already has two other players, nothing happens.

        Arguments:
            player {User} -- The player (user) to connect

        Returns:
            bool -- True if the player is now connected, False if the game is
            already full
        """
        player_obj = self.get_player_obj(player)

        # If the player isn't in the game, try to add them
        is_player_new = False
        if not player_obj:
            if self.player1 is None or self.player2 is None:
                player_obj = LiveMatchPlayer(user=player)
                is_player_new = True
            else:
                # Game is full already
                return False

        player_obj.connections += 1
        player_obj.save()

        # We have to do this AFTER saving the player object to make sure we
        # have a primary key
        if is_player_new:
            if self.player1 is None:
                self.player1 = player_obj
            elif self.player2 is None:
                self.player2 = player_obj
        return True

    def disconnect_player(self, player):
        """
        Disconnects the given player from the match. They will remain a player
        in the match, but the connections field will be decremented.

        Arguments:
            player {User} -- The player (user) to disconnect

        Returns:
            bool -- True if the player was disonnect, False if they aren't in
            the game
        """
        player_obj = self.get_player_obj(player)
        if player_obj:
            player_obj.connections -= 1
            player_obj.save()
            return True
        return False

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
        player_obj = self.get_player_obj(player)
        if player_obj:
            if player_obj.move is None:
                player_obj.move = move
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

        p1_outcome = Move.get_outcome(self.player1.move, self.player2.move)

        # Clear moves
        self.player1.move = None
        self.player2.move = None
