from django.db import models
from django.contrib.auth.models import User

from .query import PlayerQuerySet, MatchQuerySet
from .util import avg, Move


class Player(User):
    """
    Proxy for the User model. Should be used any time a User is referred to in
    the context of a match.
    """

    objects = PlayerQuerySet.as_manager()

    class Meta:
        proxy = True

    def get_owp(self):
        # Collect all opponents this player has ever had
        opponents = (
            Player.objects.exclude(id=self.id)
            .filter(matches__players=self)
            .distinct()
        )

        # Calculate each opponent's win% in matches excluding this player
        opp_win_pcts = []
        for opp in opponents:
            try:
                opp_win_pcts.append(
                    opp.match_wins.exclude(players=self).count()
                    / Match.objects.exclude(players=self)
                    .filter(players=opp)
                    .count()
                )
            except ZeroDivisionError:
                pass  # Don't include this opponent

        return (
            opponents,
            # Take the average of each opponent win%
            avg(opp_win_pcts, strict=False),
        )

    @property
    def rpi(self):
        """
        Calculates Rating Percentage Index for this player.

        https://en.wikipedia.org/wiki/Rating_percentage_index#Basketball_formula

        Uses the NCAA Men's D1 Hockey weights (because hockey is best):
        https://www.uscho.com/rankings/rpi/d-i-men/

        After some experimentation, this seems like not a great metric for our
        purposes. Leaving this in for now, but if it's going to actually be
        used, it needs to be seriously optimized in terms of queries.

        Returns:
            int -- the RPI for this player
        """
        # Right now this requires that annotate_stats has been called
        # TODO put this on the queryset instead, and do it all on the DB

        # opponent winning percentage
        opponents, owp = self.get_owp()

        # opponents' opponent winning percentage
        opp_opp_win_pcts = [opp.get_owp()[1] for opp in opponents]
        oowp = avg(opp_opp_win_pcts, strict=False)

        return self.match_win_pct * 0.24 + owp * 0.21 + oowp * 0.54


class AbstractPlayerMatch(models.Model):
    player = models.ForeignKey(Player, on_delete=models.PROTECT)
    player_num = models.IntegerField()

    class Meta:
        abstract = True
        ordering = ("player_num",)
        unique_together = (("player", "match"), ("player_num", "match"))


class AbstractGame(models.Model):
    # zero-indexed
    game_num = models.PositiveSmallIntegerField()
    # Null for ties
    winner = models.ForeignKey(
        Player,
        related_name="%(class)s_wins",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
    )

    class Meta:
        abstract = True
        ordering = ("match_id", "game_num")
        unique_together = ("game_num", "match")

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class AbstractPlayerGame(models.Model):
    player_num = models.IntegerField()
    player = models.ForeignKey(Player, on_delete=models.PROTECT)
    move = models.CharField(choices=Move.choices(), max_length=20)

    class Meta:
        abstract = True
        ordering = ("player_num",)
        unique_together = (("player", "game"), ("player_num", "game"))

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class MatchConfig(models.Model):
    """
    Static configuration fields for a match. These fields are set when the
    match is created and will never change. Used by both Match and LiveMatch.
    """

    best_of = models.PositiveSmallIntegerField()
    extended_mode = models.BooleanField()
    public = models.BooleanField()


class Match(models.Model):
    objects = MatchQuerySet.as_manager()

    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()  # Seconds
    config = models.ForeignKey(MatchConfig, on_delete=models.PROTECT)
    rematch = models.OneToOneField(
        "self",
        on_delete=models.SET_NULL,
        related_name="parent",
        null=True,
        blank=True,
    )
    # Always len=2
    players = models.ManyToManyField(
        Player, through="PlayerMatch", related_name="matches"
    )
    winner = models.ForeignKey(
        Player, related_name="match_wins", on_delete=models.PROTECT
    )

    class Meta:
        ordering = ("-start_time",)

    @property
    def loser(self):
        # TODO put this on the queryset
        return self.players.exclude(id=self.winner_id).first()


class PlayerMatch(AbstractPlayerMatch):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)


class Game(AbstractGame):
    match = models.ForeignKey(
        Match, on_delete=models.CASCADE, related_name="games"
    )
    # Always len=2
    players = models.ManyToManyField(Player, through="PlayerGame")


class PlayerGame(AbstractPlayerGame):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
