from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from django.contrib.auth.models import Group
from rest_auth.registration.views import SocialConnectView, SocialLoginView
from rest_framework import generics, permissions

from . import serializers


class GroupsView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class GroupView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "id"
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class GroupPlayerView(generics.RetrieveAPIView):
    lookup_field = "name"
    queryset = Group.objects.all()
    serializer_class = serializers.GroupUserSerializer

    def destroy(self, instance):
        # TODO check if user is last group admin
        return super().destroy(instance)


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
