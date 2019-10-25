from django.contrib.auth.models import Group
from rest_framework import serializers


class GroupSerializer(serializers.ModelSerializer):
    players = serializers.SlugRelatedField(
        source="user_set", slug_field="username", many=True, read_only=True
    )

    class Meta:
        model = Group
        fields = ("id", "name", "players")
