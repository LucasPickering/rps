from django.contrib import admin
from django.urls import include, path
from rest_auth import views as auth_views

urlpatterns = [
    path(
        "api/",
        include(
            [
                path(
                    "auth/",
                    include(
                        [
                            path(
                                "password/reset/confirm/<str:uidb64>/<str:token>/",
                                auth_views.PasswordResetConfirmView.as_view(),
                                name="password_reset_confirm",
                            ),
                            path("", include("rest_auth.urls")),
                        ]
                    ),
                ),
                path("admin/", admin.site.urls),
                path("slack/", include("slack.urls")),
                path("", include("core.urls")),
            ]
        ),
    )
]
