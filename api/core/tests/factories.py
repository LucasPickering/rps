from django.contrib.auth.models import User
from factory import SubFactory
from factory.django import DjangoModelFactory

from ..models import MatchConfig, Match


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
