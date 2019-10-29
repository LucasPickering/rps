from django.contrib.auth.models import Group, User
from guardian import shortcuts
from rest_framework import serializers


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


class PermissionsSerializer(serializers.Serializer):
    def to_representation(self, obj):
        return shortcuts.get_perms(obj, self.context["group"])

    def update(self, instance, validated_data):
        for permission in validated_data["permissions"]:
            shortcuts.assign_perm(permission, instance, self.context["group"])


class GroupUserSerializer(serializers.ModelSerializer):
    # permissions = serializers.SerializerMethodField()
    permissions = PermissionsSerializer()

    class Meta:
        model = User
        fields = ("permissions",)

    # def get_permissions(self, obj):
    #     return shortcuts.get_perms(obj, self.context["group"])

    def update(self, instance, validated_data):
        print(validated_data)
        for permission in validated_data["permissions"]:
            shortcuts.assign_perm(permission, instance, self.context["group"])
