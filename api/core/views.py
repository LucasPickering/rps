from rest_framework import generics, views, filters
from rest_framework.response import Response

from . import models, serializers
from .util import get_livematch_id


class NewMatchView(views.APIView):
    def get(self, request):
        # Generate a new match ID and return it
        return Response(
            serializers.NewMatchSerializer(
                {"match_id": get_livematch_id()}
            ).data
        )


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
    queryset = models.Player.objects.all()
    serializer_class = serializers.PlayerSerializer
