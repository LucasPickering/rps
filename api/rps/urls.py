from django.contrib import admin
from django.urls import include, path
from rest_auth import views as auth_views

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
    ),
    # Bogus path just to tell Django what URL to put in the password reset email
    # This route will actually get handled by React
    path(
        "account/password/reset/confirm/<str:uidb64>/<str:token>/",
        auth_views.PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
]
