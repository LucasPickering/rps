from collections import Counter
from datetime import timedelta
from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.db import models
from django.utils import timezone

from core.util import GameOutcome, Move, get_win_target
from core.models import (
    AbstractGame,
    AbstractPlayerGame,
    Match,
    Game,
    PlayerGame,
)
from .error import ClientError, ClientErrorType


class LivePlayerMatch(models.Model):
    """
    Holds the data for one player in a live match. THIS TABLE SHOULD NEVER BE
    MODIFIED DIRECTLY - ONLY VIA LiveMatch. If you have a lock on a LiveMatch
    row, you own can considered its LivePlayerMatchs locked.
    """

    ACTIVITY_TIMEOUT = timedelta(seconds=60)

    user = models.ForeignKey(User, on_delete=models.PROTECT)
    is_ready = models.BooleanField(default=False)
    last_activity = models.DateTimeField(auto_now_add=True)
    move = models.CharField(choices=Move.choices(), max_length=20, blank=True)

    def reset(self):
        """
        Reset's this player's state to for a new game. Does NOT update active
        timer.
        """
        self.is_ready = False
        self.move = ""

    def ready_up(self):
        """
        Sets the ready state to True (even if it is already True). Updates
        last activity time.
        """
        self.ready = True
        self.update_last_activity()

    def apply_move(self, move):
        """
        Sets the player's move to the given value. Updates last activity timer.

        Arguments:
            move {string} -- move

        Raises:
            ClientError: If a move is already set
        """
        if self.move:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Move already applied"
            )
        self.move = move
        self.update_last_activity()

    def update_last_activity(self):
        self.last_activity = timezone.now()

    def is_active(self):
        return (timezone.now() - self.last_activity) <= self.ACTIVITY_TIMEOUT

    def __str__(self):
        return f"user: {self.user}; ready: {self.is_ready}; move: {self.move}"


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
    # Null if in progress, populated once the permanent match exists
    permanent_match = models.OneToOneField(
        Match, on_delete=models.CASCADE, blank=True, null=True
    )
    start_time = models.DateTimeField(auto_now=True)
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
    def is_game_complete(self):
        return bool(
            self.player1
            and self.player2
            and self.player1.move
            and self.player2.move
        )

    @property
    def is_match_started(self):
        return bool(self.player1 and self.player2)

    @property
    def is_match_complete(self):
        # Check the FK directly to avoid a query
        return self.permanent_match_id is not None

    @property
    def is_orphaned(self):
        """
        Is this match an orphan? . An orphan has been abandoned by its
        ~parents~ players and there is no longer any value is holding onto it.

        Returns:
            bool -- True if this is an orphan, False if not
        """
        return (
            # Unstarted matches that have no connected users
            not self.is_match_started
            and not (self.player1 and self.player1.is_active)
            and not (self.player2 and self.player2.is_active)
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

    def connect_player(self, player):
        """
        Adds the given player to this match, if there is a slot open. If the
        player is already in the match, updates their activity field. If the
        match already has two other players, nothing happens.

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

        player_obj.update_last_activity()
        player_obj.save()

        # We have to do this AFTER saving the player object to make sure we
        # have a primary key
        if is_player_new:
            if self.player1 is None:
                self.player1 = player_obj
            elif self.player2 is None:
                self.player2 = player_obj
        return True

    def heartbeat(self, player):
        """
        Updates the last activity for the given player to now.

        Arguments:
            player {User} -- the player to mark activity for

        Raises:
            ClientError: If the player is not in this match
        """
        player_obj = self.get_player_obj(player)
        if player_obj:
            player_obj.update_last_activity()
            player_obj.save()
        else:
            raise ClientError(
                ClientErrorType.NOT_IN_MATCH, "Player is not in match"
            )

    def ready_up(self, player):
        """
        Sets the player's is_ready flag to True (and saves to the DB)

        Arguments:
            player {User} -- the player to ready up

        Raises:
            ClientError: If the player is not in this match
        """
        player_obj = self.get_player_obj(player)
        if player_obj:
            player_obj.ready_up()
            player_obj.save()
        else:
            raise ClientError(
                ClientErrorType.NOT_IN_MATCH, "Player is not in match"
            )

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
        if self.is_match_complete:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Match is already complete"
            )
        player_obj = self.get_player_obj(player)
        if player_obj:
            player_obj.apply_move(move)
            player_obj.save()
        else:
            raise ClientError(
                ClientErrorType.NOT_IN_MATCH, "Player is not in match"
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
            game_num=self.games.count(),
            match=self,
            winner=game_winner.user if game_winner else None,
        )
        self.games.add(game, bulk=False)

        # Create a player-game for each player in the game
        LivePlayerGame.from_player_match(self.player1, game).save()
        LivePlayerGame.from_player_match(self.player2, game).save()

        # Clear moves
        self.player1.reset()
        self.player1.save()
        self.player2.reset()
        self.player2.save()

        # Check if the match is over now
        # Build a dict of User.id:wins
        wins_by_player_id = Counter(
            self.games.exclude(winner=None).values_list("winner", flat=True)
        )
        # Get the winningest player
        winner_id, wins = max(
            wins_by_player_id.items(), key=lambda t: t[1], default=(None, None)
        )
        if winner_id is not None and wins >= get_win_target(self.best_of):
            self.save_to_permanent(winner_id=winner_id)

    def save_to_permanent(self, winner_id):
        match = Match.objects.create(
            start_time=self.start_time,
            duration=(timezone.now() - self.start_time).total_seconds(),
            best_of=self.best_of,
            winner_id=winner_id,
        )
        self.permanent_match = match  # Connect the permanent match to this one
        match.players.set([self.player1.user, self.player2.user])
        for game in self.games.all():
            game.save_to_permanent(match)
        return match


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

    def __str__(self):
        return f"match: {self.match_id}; game_num: {self.game_num}; winner: {self.winner}"

    def save_to_permanent(self, match):
        game = Game.objects.create(
            game_num=self.game_num, winner=self.winner, match=match
        )
        for player in self.liveplayergame_set.all():
            player.save_to_permanent(game)
        return game


class LivePlayerGame(AbstractPlayerGame):
    game = models.ForeignKey(LiveGame, on_delete=models.CASCADE)

    @classmethod
    def from_player_match(cls, player_match, game):
        return cls(user=player_match.user, move=player_match.move, game=game)

    def save_to_permanent(self, game):
        return PlayerGame.objects.create(
            user=self.user, move=self.move, game=game
        )
