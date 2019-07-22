from django.db import models
from django.contrib.auth.models import User

from core import util


class LiveMatch(models.Model):
    id = models.CharField(primary_key=True, max_length=32)
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
