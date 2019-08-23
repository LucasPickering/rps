from django.contrib.auth.models import User
from rest_framework import serializers

from . import models


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(default=None)
    password = serializers.CharField(default=None)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username",)


class PlayerGameSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(
        source="user", slug_field="username", read_only=True
    )

    class Meta:
        model = models.PlayerGame
        fields = ("username", "move")


class GameSerializer(serializers.ModelSerializer):
    winner = serializers.SlugRelatedField(slug_field="username", read_only=True)
    players = PlayerGameSerializer(source="playergame_set", many=True)

    class Meta:
        model = models.Game
        exclude = ("id", "match")


class MatchSerializer(serializers.ModelSerializer):
    games = GameSerializer(many=True)
    players = serializers.SlugRelatedField(
        slug_field="username", many=True, read_only=True
    )
    winner = serializers.SlugRelatedField(slug_field="username", read_only=True)

    class Meta:
        model = models.Match
        fields = "__all__"


class NewMatchSerializer(serializers.Serializer):
    match_id = serializers.CharField()
