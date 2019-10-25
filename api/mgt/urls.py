from django.urls import include, path
from rest_auth.registration.views import SocialAccountListView

from .views import GoogleConnectView, GoogleLoginView

urlpatterns = [
    path("", include("rest_auth.urls")),
    path(
        "accounts/",
        include("allauth.socialaccount.urls"),
        name="socialaccount_signup",
    ),
    path("socialaccounts/", SocialAccountListView.as_view()),
    path(
        "google/",
        include(
            [
                path("login/", GoogleLoginView.as_view()),
                path("connect/", GoogleConnectView.as_view()),
            ]
        ),
    ),
]
