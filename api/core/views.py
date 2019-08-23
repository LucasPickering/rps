import uuid
from django.contrib import auth
from django.contrib.auth.models import User
from rest_framework import generics, status, views, filters
from rest_framework.response import Response

from . import models, serializers


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
        match_id = uuid.uuid4().hex
        return Response(
            serializers.NewMatchSerializer({"match_id": match_id}).data
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
    queryset = User.objects.all()
    serializer_class = serializers.PlayerSummarySerializer


class PlayerView(generics.ListAPIView):
    lookup_field = "username"
    queryset = User.objects.all()
    serializer_class = serializers.PlayerSerializer
