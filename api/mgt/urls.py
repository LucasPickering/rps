from django.urls import include, path
from rest_auth.registration.views import SocialAccountListView

from . import views

urlpatterns = [
    path("", include("rest_auth.urls")),
    path(
        "groups/",
        include(
            [
                path("", views.GroupsView.as_view()),
                path("<str:name>/", views.GroupView.as_view()),
                path(
                    "<str:group_name>/<str:username>/",
                    views.GroupUserView.as_view(),
                ),
            ]
        ),
    ),
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
                path("login/", views.GoogleLoginView.as_view()),
                path("connect/", views.GoogleConnectView.as_view()),
            ]
        ),
    ),
]
