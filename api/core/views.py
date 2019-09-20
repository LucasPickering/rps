from rest_framework import generics, filters

from . import models, serializers

match_queryset = models.Match.objects.select_related(
    "config", "winner"
).prefetch_related(
    "players",
    "games",
    "games__winner",
    "games__playergame_set",
    "games__playergame_set__player",
)


class MatchesView(generics.ListAPIView):
    queryset = match_queryset
    serializer_class = serializers.MatchSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["start_time", "duration"]
    ordering = ["-start_time"]


class MatchView(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = match_queryset
    serializer_class = serializers.MatchSerializer


class PlayersView(generics.ListAPIView):
    queryset = models.Player.objects.annotate_match_outcomes()
    serializer_class = serializers.PlayerSummarySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["match_win_count", "match_loss_count", "match_win_pct"]


class PlayerView(generics.RetrieveAPIView):
    lookup_field = "username"
    queryset = models.Player.objects.prefetch_related(
        "matches",
        "matches__config",
        "matches__winner",
        "matches__players",
        "matches__games",
        "matches__games__winner",
        "matches__games__playergame_set",
        "matches__games__playergame_set__player",
    )
    serializer_class = serializers.PlayerSerializer
