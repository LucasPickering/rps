from allauth.socialaccount.providers.oauth2.client import OAuth2Client
from allauth.socialaccount.providers.google.views import GoogleOAuth2Adapter
from django.conf import settings
from rest_auth.registration.views import SocialConnectView, SocialLoginView


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
