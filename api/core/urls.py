from django.urls import include, path

from . import views

urlpatterns = [
    path(
        "matches/",
        include(
            [
                path("", views.MatchesView.as_view()),
                path("new/", views.NewMatchView.as_view()),
                path("<int:id>/", views.MatchView.as_view()),
            ]
        ),
    ),
    path(
        "players/",
        include(
            [
                path("", views.PlayersView.as_view()),
                path("<str:username>/", views.PlayerView.as_view()),
            ]
        ),
    ),
]
