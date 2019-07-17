from django.contrib.auth.models import User
from rest_framework import serializers

from . import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User


class UserMatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.UserMatch
        fields = ("user", "move", "outcome")

    user = serializers.SlugRelatedField(slug_field="username")


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Game

    moves = UserMatchSerializer(many=True)


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Match
        fields = "__all__"

    games = GameSerializer(many=True)
