from django.urls import include, path

from . import views

urlpatterns = [
    path("login", views.LoginView.as_view()),
    path("logout", views.LogoutView.as_view()),
    path("current-user", views.CurrentUserView.as_view()),
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
]
