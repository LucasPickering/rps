from django.contrib.auth.models import User
from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Game


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Match
        fields = "__all__"

    games = GameSerializer(many=True)