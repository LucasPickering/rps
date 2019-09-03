from django.urls import path

from . import views

urlpatterns = [
    path("", views.LiveMatchesView.as_view()),
    path("<str:id>/", views.LiveMatchView.as_view()),
]
