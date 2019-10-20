from django.urls import include, path

from .views import GoogleLoginView

urlpatterns = [
    path("", include("rest_auth.urls")),
    path(
        "accounts/",
        include("allauth.socialaccount.urls"),
        name="socialaccount_signup",
    ),
    path("google/", GoogleLoginView.as_view()),
]
