from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from django.contrib.auth.models import Group, User
from django.utils.functional import cached_property
from rest_auth.registration.views import SocialConnectView, SocialLoginView
from rest_framework import generics, permissions, status
from rest_framework.response import Response

from . import serializers


class GroupsView(generics.ListCreateAPIView):
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class GroupView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "name"
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]


class GroupUserView(generics.RetrieveUpdateDestroyAPIView):
    lookup_field = "username"
    serializer_class = serializers.GroupUserSerializer
    permission_classes = [permissions.DjangoModelPermissionsOrAnonReadOnly]

    @cached_property
    def group(self):
        return Group.objects.get(name=self.kwargs["group_name"])

    def get_queryset(self):
        return self.group.user_set

    def get_serializer_context(self):
        return {"group": self.group}

    def destroy(self, request, group_name, username):
        # TODO check if user is last group admin
        user = User.objects.get(username=username)
        Group.objects.get(name=group_name).user_set.remove(user)
        return Response(status=status.HTTP_204_NO_CONTENT)


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
