from django.db import models
from django.contrib.auth.models import User

from .util import Move


class AbstractGame(models.Model):
    # zero-indexed
    game_num = models.PositiveSmallIntegerField()
    # Null for ties
    winner = models.ForeignKey(
        User,
        related_name="%(class)s_wins",
        null=True,
        blank=True,
        on_delete=models.PROTECT,
    )

    class Meta:
        abstract = True
        ordering = ("game_num",)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class AbstractPlayerGame(models.Model):
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    move = models.CharField(choices=Move.choices(), max_length=20)

    def save(self, *args, **kwargs):
        self.full_clean()
        super().save(*args, **kwargs)


class Match(models.Model):
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()  # Seconds
    best_of = models.PositiveSmallIntegerField()
    players = models.ManyToManyField(User)  # Always len=2
    # Null for unfinished matches, i.e. when Nick rage quits
    winner = models.ForeignKey(
        User, related_name="match_wins", null=True, on_delete=models.PROTECT
    )


class Game(AbstractGame):
    match = models.ForeignKey(
        Match, on_delete=models.CASCADE, related_name="games"
    )
    # Always len=2
    players = models.ManyToManyField(User, through="PlayerGame")


class PlayerGame(AbstractPlayerGame):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
