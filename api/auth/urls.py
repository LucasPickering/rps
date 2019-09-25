from django.urls import include, path

from .views import GoogleLoginView

urlpatterns = [
    path("", include("rest_auth.urls")),
    path("google/", GoogleLoginView.as_view()),
]
