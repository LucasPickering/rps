from rest_framework import serializers

from core import models


# For /api/matches/


class NewMatchSerializer(serializers.Serializer):
    match_id = serializers.CharField()


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
