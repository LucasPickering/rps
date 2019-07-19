import uuid
from rest_framework import generics, views
from django.http import HttpResponseRedirect

from . import models, serializers


class MatchRedirectView(views.APIView):
    def get(self, request):
        match_id = uuid.uuid4().hex
        return HttpResponseRedirect(f"/match/{match_id}")


class MatchesView(generics.ListAPIView):
    queryset = models.Match.objects.all()
    serializer_class = serializers.MatchSerializer
