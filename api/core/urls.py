from django.urls import include, path

from . import views

urlpatterns = [
    path("login", views.LoginView.as_view()),
    path("logout", views.LogoutView.as_view()),
    path(
        "matches/",
        include(
            [
                path("new", views.NewMatchView.as_view()),
                path("", views.MatchesView.as_view()),
            ]
        ),
    ),
]
