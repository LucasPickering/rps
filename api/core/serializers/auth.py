from rest_auth import serializers


class PasswordResetSerializer(serializers.PasswordResetSerializer):
    """
    Serializer for requesting a password reset e-mail. This is basically the
    default serializer, except it forces HTTPS because the site is always
    HTTPS (even in dev), but HTTP to Django because the proxy handles HTTPS.
    """

    def get_email_options(self):
        return {"use_https": True}
