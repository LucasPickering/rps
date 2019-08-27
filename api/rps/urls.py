from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path(
        "api/",
        include(
            [
                path("auth/", include("rest_auth.urls")),
                path("admin/", admin.site.urls),
                path("slack/", include("slack.urls")),
                path("", include("core.urls")),
            ]
        ),
    )
]
