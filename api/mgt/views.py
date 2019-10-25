from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from django.contrib.auth.models import Group
from rest_auth.registration.views import SocialConnectView, SocialLoginView
from rest_framework import generics, permissions

from . import serializers


class ReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS


class GroupsView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class GroupView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [ReadOnly | permissions.DjangoObjectPermissions]


class GroupPlayerView(generics.RetrieveAPIView):
    lookup_field = "name"
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


class GoogleLoginView(SocialLoginView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = (
        f"https://{settings.RPS_HOSTNAME}/account/login/redirect/google"
    )


class GoogleConnectView(SocialConnectView):
    adapter_class = GoogleOAuth2Adapter
    client_class = OAuth2Client
    callback_url = (
        f"https://{settings.RPS_HOSTNAME}/account/connect/redirect/google"
    )
