from django.urls import include, path

from . import views

urlpatterns = [
    path(
        "matches/",
        include(
            [
                path("", views.MatchesView.as_view()),
                # This is a subdivision of matches/ to stay consistent with
                # the frontend URLs
                path("live/", include("livematch.urls")),
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
