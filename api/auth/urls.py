from django.urls import include, path

from .views import GoogleConnectView, GoogleLoginView

urlpatterns = [
    path("", include("rest_auth.urls")),
    path(
        "accounts/",
        include("allauth.socialaccount.urls"),
        name="socialaccount_signup",
    ),
    path(
        "google/",
        include(
            [
                path("", GoogleLoginView.as_view()),
                path("connect/", GoogleConnectView.as_view()),
            ]
        ),
    ),
]
