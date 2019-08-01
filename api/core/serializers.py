from django.contrib.auth.models import User
from rest_framework import serializers

from . import models


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(default=None)
    password = serializers.CharField(default=None)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email")


class GameSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Game


class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Match
        fields = "__all__"

    games = GameSerializer(many=True)


class NewMatchSerailizer(serializers.Serializer):
    match_id = serializers.CharField()
