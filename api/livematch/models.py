from collections import Counter
from datetime import datetime, timedelta
from django.db import models
from django.utils import timezone

from core.util import GameOutcome, Move, get_livematch_id, get_win_target
from core.models import (
    AbstractGame,
    AbstractPlayerGame,
    AbstractPlayerMatch,
    MatchConfig,
    Match,
    Game,
    Player,
    PlayerGame,
    PlayerMatch,
)
from .error import ClientError, ClientErrorType


class LiveMatch(models.Model):
    """
    Yeet

    `move` unpopulated for 0/1 players => game is in progress
    `move` populated for both players => game is complete
    `is_ready == True` for both players => start new game
    """

    id = models.CharField(
        primary_key=True, max_length=32, default=get_livematch_id
    )
    config = models.ForeignKey(MatchConfig, on_delete=models.PROTECT)
    # Null if in progress, populated once the permanent match exists
    permanent_match = models.OneToOneField(
        Match, on_delete=models.CASCADE, blank=True, null=True
    )
    rematch = models.OneToOneField(
        "self",
        # Once a rematch has been created, we want to know that its parent is
        # always available. This is needed to link the subsequent Match objects
        # together. Once the latest match gets deleted, it's fine to cascade
        # all the parents because they all must be older.
        on_delete=models.CASCADE,
        related_name="parent",
        null=True,
        blank=True,
    )
    start_time = models.DateTimeField(auto_now_add=True)
    players = models.ManyToManyField(
        Player, through="LivePlayerMatch", related_name="live_matches"
    )

    @property
    def is_game_complete(self):
        player_matches = self.liveplayermatch_set.all()
        return player_matches.count() >= 2 and all(
            bool(pm.move) for pm in player_matches
        )

    @property
    def is_match_started(self):
        return self.players.count() >= 2

    @property
    def is_match_complete(self):
        # Check the FK directly to avoid a query
        return self.permanent_match_id is not None

    @property
    def player1(self):
        """
        Convenience property for testing
        """
        return self.liveplayermatch_set.filter(player_num=0).first()

    @property
    def player2(self):
        """
        Convenience property for testing
        """
        return self.liveplayermatch_set.filter(player_num=1).first()

    def get_player_match(self, player):
        """
        Gets the LivePlayerMatch object for the given Player.

        Arguments:
            player {Player} -- The self player

        Raises:
            ClientError: NOT_IN_MATCH if player is not in this match

        Returns:
            LivePlayerMatch -- The LivePlayerMatch object for that player
        """
        try:
            return self.liveplayermatch_set.get(player=player)
        except LivePlayerMatch.DoesNotExist:
            raise ClientError(
                ClientErrorType.NOT_IN_MATCH, "Player is not in match"
            )

    def is_participant(self, player):
        return self.players.filter(id=player.id).exists()

    def start_new_game(self):
        """
        Initiates a new game by resetting `move` for each player.
        """
        # Clear moves
        self.liveplayermatch_set.update(move="")

    def player_join(self, player):
        """
        Adds the given player to this match, if there is a slot open. If the
        player is already in the match, updates their activity field. If the
        match already has two other players, or if this player is not
        authenticated, nothing happens (in this case, the player should become
        a spectator).

        Arguments:
            player {Player} -- The player (user) to connect

        Returns:
            bool -- True if the player is now connected, False if the match is
            already full or the player is not logged in
        """
        current_player_count = self.players.count()
        # If the player isn't logged in or the match is full, they can't join
        if not player.is_authenticated or current_player_count >= 2:
            return False
        # We now know the match has an open slot

        # If the player isn't in the match, add them. If they are already, just
        # update last_activity
        player_match, created = self.liveplayermatch_set.get_or_create(
            player=player,
            defaults={"player_num": current_player_count, "is_ready": True},
        )
        if not created:
            player_match.update_last_activity()
        player_match.save()

        return True

    def heartbeat(self, player):
        """
        Updates the last activity for the given player to now.

        Arguments:
            player {Player} -- the player to mark activity for

        Raises:
            ClientError: If the player is not in this match
        """
        player_obj = self.get_player_match(player)
        player_obj.update_last_activity()
        player_obj.save()

    def ready_up(self, player):
        """
        Sets the player's is_ready flag to True (and saves to the DB)

        Arguments:
            player {Player} -- the player to ready up

        Raises:
            ClientError: If the player is not in this match
        """
        player_match = self.get_player_match(player)
        player_match.ready_up()
        player_match.save()

        # If everyone is ready, kick off the next game
        if all(
            self.liveplayermatch_set.all().values_list("is_ready", flat=True)
        ):
            self.start_new_game()

    def apply_move(self, player, move):
        """
        Applies the given move for the given player. If the move completes the
        game, the completed game will be processed and the match may end.

        Arguments:
            player {Player} -- The player to make a move for
            move {string} -- The move to make

        Raises:
            ClientError: If the move is invalid, this player has already moved,
            or they are not in the match
        """
        if not Move.is_valid_move(move, self.config.extended_mode):
            raise ClientError(
                ClientErrorType.INVALID_MOVE, f"Unknown move: {move}"
            )

        if self.is_match_complete:
            raise ClientError(
                ClientErrorType.INVALID_MOVE, "Match is already complete"
            )

        player_obj = self.get_player_match(player)
        player_obj.apply_move(move)
        player_obj.save()

        if self.is_game_complete:
            self.process_complete_game()

    def process_complete_game(self):
        player_matches = self.liveplayermatch_set.all()

        # Find the game winner
        # player1 always comes first because of the model's ordering
        p1_match, p2_match = player_matches
        p1_outcome = Move.get_outcome(p1_match.move, p2_match.move)
        if p1_outcome == GameOutcome.WIN:
            game_winner = p1_match.player
        elif p1_outcome == GameOutcome.LOSS:
            game_winner = p2_match.player
        else:
            game_winner = None

        # This need to be created & saved first so it gets a PK
        game = LiveGame(
            game_num=self.games.count(), match=self, winner=game_winner
        )
        self.games.add(game, bulk=False)

        # Create a player-game for each player in the game
        LivePlayerGame.objects.bulk_create(
            [
                LivePlayerGame.from_player_match(pm, game)
                for pm in player_matches
            ]
        )

        # reset is_ready for all players
        self.liveplayermatch_set.update(is_ready=False)

        # Check if the match is over now
        # Build a dict of Player.id:wins
        wins_by_player_id = Counter(
            self.games.exclude(winner=None).values_list("winner", flat=True)
        )
        # Get the winningest player
        winner_id, wins = max(
            wins_by_player_id.items(), key=lambda t: t[1], default=(None, None)
        )
        if winner_id is not None and wins >= get_win_target(
            self.config.best_of
        ):
            self.save_to_permanent(winner_id=winner_id)

    def save_to_permanent(self, winner_id):
        match = Match.objects.create(
            start_time=self.start_time,
            duration=(timezone.now() - self.start_time).total_seconds(),
            config=self.config,
            winner_id=winner_id,
        )
        self.permanent_match = match  # Connect the permanent match to this one
        self.save()

        # If this match is a rematch, link our newly-created Match to the
        # parent Match
        try:
            self.parent.permanent_match.rematch = match
            self.parent.permanent_match.save()
        except LiveMatch.DoesNotExist:
            pass  # No parent match

        PlayerMatch.objects.bulk_create(
            [pm.to_permanent(match) for pm in self.liveplayermatch_set.all()]
        )
        for game in self.games.all():
            game.save_to_permanent(match)

    def make_rematch(self):
        if self.rematch is None:
            # Create a new LiveMatch with the same config and players
            rematch = LiveMatch.objects.create(config=self.config)
            rematch.save()

            for pm in self.liveplayermatch_set.all():
                pm.clone_for_rematch(rematch)

            self.rematch = rematch
            self.save()
        return self.rematch


class LivePlayerMatch(AbstractPlayerMatch):
    """
    Holds the data for one player in a live match. THIS TABLE SHOULD NEVER BE
    MODIFIED DIRECTLY - ONLY VIA LiveMatch. If you have a lock on a LiveMatch
    row, you own can considered its LivePlayerMatchs locked.
    """

    ACTIVITY_TIMEOUT = timedelta(seconds=10)

    match = models.ForeignKey(LiveMatch, on_delete=models.CASCADE)
    last_activity = models.DateTimeField(auto_now_add=True)
    is_ready = models.BooleanField(default=False)
    move = models.CharField(choices=Move.choices(), max_length=20, blank=True)
    accepted_rematch = models.BooleanField(default=False)

    def ready_up(self):
        """
        Sets the ready state to True (even if it is already True). Updates
        last activity time.
        """
        self.is_ready = True
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

    @property
    def is_active(self):
        return (timezone.now() - self.last_activity) <= self.ACTIVITY_TIMEOUT

    def clone_for_rematch(self, rematch):
        """
        Clones this object, creating a new one with the same player but
        other fields initialized to prepare for a rematch. is_ready is set to
        True and last_activity is initialied to 1970-01-01. This DOES save
        the row to the DB.

        Returns:
            LivePlayerMatch -- the created LivePlayerMatch
        """
        new_lpm = LivePlayerMatch.objects.create(
            match=rematch,
            player=self.player,
            player_num=self.player_num,
            is_ready=True,
        )
        new_lpm.last_activity = datetime.fromtimestamp(0)
        new_lpm.save()
        return new_lpm

    def to_permanent(self, match):
        return PlayerMatch(
            player_id=self.player_id, match=match, player_num=self.player_num
        )

    def __str__(self):
        return (
            f"player: {self.player}; last_activity: {self.last_activity};"
            + f" ready: {self.is_ready}; move: {self.move}"
        )


class LiveGame(AbstractGame):
    match = models.ForeignKey(
        LiveMatch, on_delete=models.CASCADE, related_name="games"
    )
    # Always len=2
    players = models.ManyToManyField(Player, through="LivePlayerGame")

    def __str__(self):
        return (
            f"match: {self.match_id}; game_num: {self.game_num};"
            + f" winner: {self.winner}"
        )

    def save_to_permanent(self, match):
        game = Game.objects.create(
            game_num=self.game_num, winner=self.winner, match=match
        )
        PlayerGame.objects.bulk_create(
            pg.to_permanent(game) for pg in self.liveplayergame_set.all()
        )
        game.save()


class LivePlayerGame(AbstractPlayerGame):
    game = models.ForeignKey(LiveGame, on_delete=models.CASCADE)

    @classmethod
    def from_player_match(cls, player_match, game):
        return cls(
            player=player_match.player,
            move=player_match.move,
            player_num=player_match.player_num,
            game=game,
        )

    def to_permanent(self, game):
        return PlayerGame(
            player_id=self.player_id,
            player_num=self.player_num,
            move=self.move,
            game=game,
        )
