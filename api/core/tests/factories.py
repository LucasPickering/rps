from django.contrib.auth.models import User
from django.utils import timezone
from factory import SubFactory
from factory.django import DjangoModelFactory

from ..models import MatchConfig, Match, PlayerMatch


class UserFactory(DjangoModelFactory):
    class Meta:
        model = User

    username = "user"
    password = "password"


class MatchConfigFactory(DjangoModelFactory):
    class Meta:
        model = MatchConfig

    best_of = 3
    extended_mode = False
    public = False


class MatchFactory(DjangoModelFactory):
    class Meta:
        model = Match

    config = SubFactory(MatchConfigFactory)


def match_factory(player1, player2, winner):
    # TODO make this a real factory class
    m = Match.objects.create(
        config=MatchConfigFactory(),
        start_time=timezone.now(),
        duration=10,
        winner=winner,
    )
    PlayerMatch.objects.create(match=m, player=player1, player_num=0)
    PlayerMatch.objects.create(match=m, player=player2, player_num=1)
    return m
