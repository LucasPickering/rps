from django.contrib.auth.models import Group
from rest_framework import serializers
from rest_framework_guardian.serializers import ObjectPermissionsAssignmentMixin


class GroupSerializer(serializers.ModelSerializer):
    players = serializers.SlugRelatedField(
        source="user_set", slug_field="username", many=True, read_only=True
    )

    class Meta:
        model = Group
        fields = ("id", "name", "players")

    def create(self, validated_data):
        obj = super().create(validated_data)
        obj.user_set.add(self.context["request"].user)
        return obj

    def get_permissions_map(self, created):
        current_user = self.context["request"].user
        return {"change_group": []}


class GroupUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ()
