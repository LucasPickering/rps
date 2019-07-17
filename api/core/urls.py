from django.urls import path

from . import views

urlpatterns = [path("matches", views.MatchesView.as_view())]
