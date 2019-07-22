from django.urls import include, path

from . import views

urlpatterns = [
    path(
        "matches/",
        include(
            [
                path("new", views.NewMatchView.as_view()),
                path("", views.MatchesView.as_view()),
            ]
        ),
    )
]
