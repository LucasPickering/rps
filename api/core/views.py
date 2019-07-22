import uuid
from rest_framework import generics, views
from rest_framework.response import Response

from . import models, serializers


class NewMatchView(views.APIView):
    def get(self, request):
        # Generate a new match ID and return it
        match_id = uuid.uuid4().hex
        return Response(
            serializers.NewMatchSerailizer({"match_id": match_id}).data
        )


class MatchesView(generics.ListAPIView):
    queryset = models.Match.objects.all()
    serializer_class = serializers.MatchSerializer
