from django.urls import path

from django.http import HttpRequest
from django.views.decorators.csrf import csrf_exempt

from slack_bolt.adapter.django import SlackRequestHandler
from .listeners import app

handler = SlackRequestHandler(app=app)


@csrf_exempt
def slack_events_handler(request: HttpRequest):
    return handler.handle(request)


def slack_oauth_handler(request: HttpRequest):
    return handler.handle(request)


urlpatterns = [
    path("events", slack_events_handler, name="handle"),
    path("install", slack_oauth_handler, name="install"),
    path("oauth_redirect", slack_oauth_handler, name="oauth_redirect"),
]
