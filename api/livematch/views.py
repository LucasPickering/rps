from rest_framework import generics, permissions

from . import models, serializers


class LiveMatchesView(generics.ListCreateAPIView):
    queryset = models.LiveMatch.objects.filters(public=True)
    serializer_class = serializers.LiveMatchSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class LiveMatchView(generics.RetrieveAPIView):
    lookup_field = "id"
    queryset = models.LiveMatch.objects.all()
    serializer_class = serializers.LiveMatchSerializer
