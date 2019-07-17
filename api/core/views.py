from rest_framework import generics

from . import models, serializers


class MatchesView(generics.ListAPIView):
    queryset = models.Match.objects.all()
    serializer_class = serializers.MatchSerializer
