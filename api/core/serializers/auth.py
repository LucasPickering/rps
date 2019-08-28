from django.conf import settings
from rest_auth import serializers


class PasswordResetSerializer(serializers.PasswordResetSerializer):
    """
    Serializer for requesting a password reset e-mail. This is basically the
    default serializer, except it forces HTTPS because the site is always
    HTTPS (even in dev), but HTTP to Django because the proxy handles HTTPS.
    """

    def save(self):
        request = self.context.get("request")
        # Set some values to trigger the send_email method.
        opts = {
            "use_https": True,  # This is the part that's changed
            "from_email": getattr(settings, "DEFAULT_FROM_EMAIL"),
            "request": request,
        }
        self.reset_form.save(**opts)
