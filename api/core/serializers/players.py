from rest_framework import serializers

from core.models import Player
from .matches import MatchSerializer


# For /api/players/


class PlayerSerializer(serializers.ModelSerializer):
    matches = MatchSerializer(many=True)

    class Meta:
        model = Player
        fields = ("username", "matches")


class PlayerSummarySerializer(serializers.ModelSerializer):
    match_win_count = serializers.IntegerField()
    match_loss_count = serializers.IntegerField()
    match_win_pct = serializers.FloatField()

    class Meta:
        model = Player
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
