from django.contrib.auth.models import User
from rest_framework import serializers

from .matches import MatchSerializer


# For /api/players/


class PlayerSerializer(serializers.ModelSerializer):
    matches = MatchSerializer(many=True)

    class Meta:
        model = User
        fields = ("username", "matches")


class PlayerSummarySerializer(serializers.ModelSerializer):
    match_wins = serializers.SerializerMethodField()
    match_losses = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ("username", "match_wins", "match_losses")

    def get_match_wins(self, obj):
        return obj.matches.filter(winner=obj).count()

    def get_match_losses(self, obj):
        return obj.matches.exclude(winner=obj).count()
