from rest_framework import generics, permissions

from . import models, serializers


class LiveMatchesView(generics.ListCreateAPIView):
    queryset = models.LiveMatch.objects.all()
    serializer_class = serializers.LiveMatchConfigSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LiveMatchView(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = models.LiveMatch.objects.all()
    serializer_class = serializers.LiveMatchConfigSerializer
