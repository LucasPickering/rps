from django.db import models
from django.contrib.auth.models import User

from . import util


class Match(models.Model):
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()
    best_of = models.PositiveSmallIntegerField()
    players = models.ManyToManyField(User)  # Always len=2
    # Null for incomplete matches, i.e. when Nick rage quits
    winner = models.ForeignKey(
        User, related_name="match_wins", null=True, on_delete=models.PROTECT
    )


class Game(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    players = models.ManyToManyField(User, through="UserMove")  # Always len=2
    # Null for ties
    winner = models.ForeignKey(
        User, related_name="game_wins", null=True, on_delete=models.PROTECT
    )


class UserMove(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    move = models.CharField(choices=util.Move.choices(), max_length=20)


class LiveMatch(models.Model):
    uuid = models.CharField(max_length=32)
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
