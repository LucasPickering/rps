from django.contrib.auth.models import User
from rest_framework import serializers

# For /api/login/


class LoginSerializer(serializers.Serializer):
    username = serializers.CharField(default=None)
    password = serializers.CharField(default=None)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("username", "email")
