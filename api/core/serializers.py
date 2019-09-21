from rest_framework import serializers

from . import models


# For /api/matches/


class NewMatchSerializer(serializers.Serializer):
    match_id = serializers.CharField()


class PlayerGameSerializer(serializers.ModelSerializer):
    username = serializers.SlugRelatedField(
        source="player", slug_field="username", read_only=True
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


class MatchConfigSerializer(serializers.ModelSerializer):
    best_of = serializers.IntegerField(default=5)
    extended_mode = serializers.BooleanField(default=False)
    public = serializers.BooleanField(default=False)

    class Meta:
        model = models.MatchConfig
        exclude = ("id",)

    def validate_best_of(self, best_of):
        if best_of <= 0 or best_of % 2 == 0:
            raise serializers.ValidationError("Must be a positive odd number")
        return best_of


class MatchSerializer(serializers.ModelSerializer):
    config = MatchConfigSerializer()
    games = GameSerializer(many=True)
    players = serializers.SlugRelatedField(
        slug_field="username", many=True, read_only=True
    )
    winner = serializers.SlugRelatedField(slug_field="username", read_only=True)
    parent = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = models.Match
        fields = "__all__"


# For /api/players/


class PlayerSerializer(serializers.ModelSerializer):
    matches = MatchSerializer(many=True)

    class Meta:
        model = models.Player
        fields = ("username", "matches")


class PlayerSummarySerializer(serializers.ModelSerializer):
    match_win_count = serializers.IntegerField()
    match_loss_count = serializers.IntegerField()
    match_win_pct = serializers.FloatField()

    class Meta:
        model = models.Player
        fields = (
            "username",
            "match_win_count",
            "match_loss_count",
            "match_win_pct",
        )

    def get_match_wins(self, obj):
        return obj.matches.filter(winner=obj).count()

    def get_match_losses(self, obj):
        return obj.matches.exclude(winner=obj).count()
