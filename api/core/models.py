from django.db import models
from django.contrib.auth.models import User

from . import util


class Match(models.Model):
    start_time = models.DateTimeField()
    duration = models.PositiveIntegerField()
    best_of = models.PositiveSmallIntegerField()


class UserMatch(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)
    outcome = models.CharField(
        choices=tuple((oc, oc) for oc in (util.OUTCOME_WIN, util.OUTCOME_LOSS)),
        max_length=20,
    )


class Game(models.Model):
    match = models.ForeignKey(Match, on_delete=models.CASCADE)


class UserMove(models.Model):
    game = models.ForeignKey(Game, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.PROTECT)
    move = models.CharField(
        choices=tuple((mv, mv) for mv in util.MOVES), max_length=20
    )
    outcome = models.CharField(
        choices=tuple(
            (oc, oc)
            for oc in (util.OUTCOME_WIN, util.OUTCOME_LOSS, util.OUTCOME_TIE)
        ),
        max_length=20,
    )
