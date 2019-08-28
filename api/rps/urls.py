from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("api/admin/", admin.site.urls),
    path("api/slack/", include("slack.urls")),
    path("api/", include("core.urls")),
]
