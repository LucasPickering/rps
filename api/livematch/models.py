from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models

from core.util import GameOutcome, Move
from core.models import AbstractGame, AbstractPlayerGame
from .error import ClientError, ClientErrorType


class LivePlayerMatch(models.Model):
    """
    Holds the data for one player in a live match. THIS TABLE SHOULD NEVER BE
    MODIFIED DIRECTLY - ONLY VIA LiveMatch. If you have a lock on a LiveMatch
    row, you own can considered its LivePlayerMatchs locked.
    """

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    # There's potential for bugs here, if the server goes down while a user
    # is connected. Maybe we should just wipe the LiveMatch table on startup.
    connections = models.PositiveSmallIntegerField(default=0)
    move = models.CharField(choices=Move.choices(), max_length=20, blank=True)

    def __str__(self):
        return f"user: {self.user}; connections: {self.connections}; move: {self.move}"


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    start_time = models.DateField(auto_now=True)
    best_of = models.PositiveSmallIntegerField(default=5)
    # Null here means no player has joined yet
    player1 = models.OneToOneField(
        LivePlayerMatch,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        related_name="match_as_p1",
    )
    player2 = models.OneToOneField(
        LivePlayerMatch,
        blank=True,
        null=True,
        on_delete=models.PROTECT,
        related_name="match_as_p2",
    )

    def clean(self):
        # Validation
        if (
            self.player1
            and self.player2
            and self.player1.user == self.player2.user
        ):
            raise ValidationError(
                f"User {self.player1.user} is both player1 and player2"
            )

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)

    @property
    def is_in_progress(self):
        return self.player1 and self.player2

    @property
    def is_game_complete(self):
        return (
            self.player1
            and self.player2
            and self.player1.move
            and self.player2.move
        )

    def get_self_and_opponent_objs(self, player_user):
        if self.player1 and player_user == self.player1.user:
            return (self.player1, self.player2)
        if self.player2 and player_user == self.player2.user:
            return (self.player2, self.player1)
        return (None, None)

    def get_player_obj(self, player_user):
        self_obj, _ = self.get_self_and_opponent_objs(player_user)
        return self_obj

    def get_state_for_player(self, player_user):
        self_obj, opponent_obj = self.get_self_and_opponent_objs(player_user)

        if not self_obj:
            raise RuntimeError(
                "Cannot get state for player that is not in game"
            )
        return {
            "best_of": self.best_of,
            "opponent": {
                "name": opponent_obj.user.username,
                "is_connected": opponent_obj.connections > 0,
            }
            if opponent_obj
            else None,
            "is_in_progress": self.is_in_progress,
            "selected_move": self_obj.move,
            "games": [
                game.get_game_summary_for_player(player_user)
                for game in self.games.all()
            ],
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
                player_obj = LivePlayerMatch(user=player)
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
            # If we now have two players connected, start a game
            if self.player1 and self.player2:
                self.game_in_progress = True
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
        Applies the given move for the given player. If the move completes the
        game, the completed game will be processed and the match may end.

        Arguments:
            player {User} -- The player to make a move for
            move {string} -- The move to make

        Raises:
            ClientError: If the move is invalid, this player has already moved,
            or they are not in the match
        """
        player_obj = self.get_player_obj(player)
        print("apply_move", player_obj)
        if player_obj:
            if player_obj.move:
                raise ClientError(
                    ClientErrorType.INVALID_MOVE, "Move already applied"
                )
            else:
                player_obj.move = move
                player_obj.save()
        else:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Player not in match"
            )

        if self.is_game_complete:
            self.process_complete_game()

    def process_complete_game(self):
        p1_outcome = Move.get_outcome(self.player1.move, self.player2.move)
        if p1_outcome == GameOutcome.WIN:
            game_winner = self.player1
        elif p1_outcome == GameOutcome.LOSS:
            game_winner = self.player2
        else:
            game_winner = None

        # This need to be created & saved first so it gets a PK
        game = LiveGame(
            game_num=self.games.count(), match=self, winner=game_winner
        )
        game.save()

        p1_game = LivePlayerGame.from_player_match(self.player1, game)
        p1_game.save()
        p2_game = LivePlayerGame.from_player_match(self.player2, game)
        p2_game.save()

        # Clear moves
        self.player1.move = None
        self.player2.move = None

        wins_by_player = self.games.exclude(winner=None).annotate(
            win_count=models.Count("winner")
        )
        print("wins_by_player", wins_by_player)
        # TODO

        def save_to_permanent(self):
            # TODO
            pass


class LiveGame(AbstractGame):
    match = models.ForeignKey(
        LiveMatch, on_delete=models.CASCADE, related_name="games"
    )
    # Always len=2
    players = models.ManyToManyField(User, through="LivePlayerGame")

    def get_self_and_opponent_objs(self, player_user):
        if self.players.count() != 2:
            raise RuntimeError(
                f"Expected 2 related players, but got {len(self.players)}"
            )
        player1, player2 = self.liveplayergame_set.all()
        if player1 and player_user == player1.user:
            return (player1, player2)
        if player2 and player_user == player2.user:
            return (player2, player1)
        return (None, None)

    def get_game_summary_for_player(self, player_user):
        self_obj, opponent_obj = self.get_self_and_opponent_objs(player_user)
        print(self_obj, opponent_obj)
        return {
            "self_move": self_obj.move,
            "opponent_move": opponent_obj.move,
            "outcome": Move.get_outcome(self_obj.move, opponent_obj.move),
        }


class LivePlayerGame(AbstractPlayerGame):
    game = models.ForeignKey(LiveGame, on_delete=models.CASCADE)

    @classmethod
    def from_player_match(cls, player_match, game):
        return cls(user=player_match.user, move=player_match.move, game=game)
