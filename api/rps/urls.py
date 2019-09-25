from django.contrib import admin
from django.urls import include, path
from rest_auth import views as auth_views
from django.conf import settings

urlpatterns = [
    path(
        "api/",
        include(
            [
                path("auth/", include("auth.urls")),
                path("admin/", admin.site.urls),
                path("slack/", include("slack.urls")),
                path("", include("core.urls")),
            ]
        ),
    )
]


if settings.DEBUG:
    import debug_toolbar

    urlpatterns = [
        path("__debug__/", include(debug_toolbar.urls))
    ] + urlpatterns
