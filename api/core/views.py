from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import generics, filters

from .filters import PlayerFilter
from .models import Match, Player
from .serializers import (
    MatchSerializer,
    PlayerSerializer,
    PlayerSummarySerializer,
)

match_queryset = Match.objects.select_related(
    "config", "winner", "loser", "rematch", "parent"
).prefetch_related(
    "players",
    "games",
    "games__winner",
    "games__playergame_set",
    "games__playergame_set__player",
)


class MatchesView(generics.ListAPIView):
    queryset = match_queryset
    serializer_class = MatchSerializer
    filter_backends = [filters.OrderingFilter]
    ordering_fields = ["start_time", "duration"]
    ordering = ["-start_time"]


class MatchView(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = match_queryset
    serializer_class = MatchSerializer


class PlayersView(generics.ListAPIView):
    queryset = Player.objects.annotate_stats()
    serializer_class = PlayerSummarySerializer
    filter_backends = [
        filters.OrderingFilter,
        filters.SearchFilter,
        DjangoFilterBackend,
    ]
    filterset_class = PlayerFilter
    search_fields = ["username"]
    ordering_fields = ["match_win_count", "match_loss_count", "match_win_pct"]


class PlayerView(generics.RetrieveAPIView):
    lookup_field = "username"
    queryset = Player.objects.prefetch_related(
        "matches",
        "matches__config",
        "matches__parent",
        "matches__winner",
        "matches__loser",
        "matches__players",
        "matches__games",
        "matches__games__winner",
        "matches__games__playergame_set",
        "matches__games__playergame_set__player",
    ).annotate_stats()
    serializer_class = PlayerSerializer
