from django.contrib import auth
from django.contrib.auth.models import User
from rest_framework import generics, status, views, filters
from rest_framework.response import Response

from . import models, serializers
from .util import get_livematch_id


class LoginView(views.APIView):
    def post(self, request):
        serializer = serializers.LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        login = serializer.validated_data

        user = auth.authenticate(
            request, username=login["username"], password=login["password"]
        )
        if user is not None:
            auth.login(request, user)
            return Response(serializers.UserSerializer(user).data)
        else:
            return Response(
                {"detail": "incorrect username or password"},
                status=status.HTTP_401_UNAUTHORIZED,
            )


class LogoutView(views.APIView):
    def post(self, request):
        auth.logout(request)
        return Response({})


class CurrentUserView(views.APIView):
    def get(self, request):
        user = request.user
        return Response(
            serializers.UserSerializer(user).data
            if user.is_authenticated
            else None
        )


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
    ordering_fields = ["match_win_count"]
    ordering = ["-match_win_count"]


class PlayerView(generics.RetrieveAPIView):
    lookup_field = "username"
    queryset = models.Player.objects.all()
    serializer_class = serializers.PlayerSerializer
