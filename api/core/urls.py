from django.urls import path

from . import views

urlpatterns = [
    path("match", views.MatchRedirectView.as_view()),
    path("matches", views.MatchesView.as_view()),
]
