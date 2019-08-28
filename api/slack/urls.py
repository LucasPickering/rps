from django.urls import include, path

from . import views

urlpatterns = [
    path("", views.SlackIntegrationView.as_view()),
]
