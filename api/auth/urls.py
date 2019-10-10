from django.urls import include, path

urlpatterns = [path("", include("rest_social_auth.urls_session"))]
