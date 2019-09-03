from rest_framework import generics, filters

from . import models, serializers


class MatchesView(generics.ListAPIView):
    queryset = models.Match.objects.all()
    serializer_class = serializers.MatchSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["start_time", "duration"]
    ordering = ["-start_time"]


class MatchView(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = models.Match.objects.all()
    serializer_class = serializers.MatchSerializer


class PlayersView(generics.ListAPIView):
    queryset = models.Player.objects.annotate_match_outcomes()
    serializer_class = serializers.PlayerSummarySerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["match_win_count", "match_loss_count", "match_win_pct"]


class PlayerView(generics.RetrieveAPIView):
    lookup_field = "username"
    queryset = models.Player.objects.prefetch_related("matches").all()
    serializer_class = serializers.PlayerSerializer
