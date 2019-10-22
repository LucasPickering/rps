from django.contrib.auth.models import Group
from django_filters import rest_framework as filters

from .models import Player


class PlayerFilter(filters.FilterSet):
    group__name = filters.CharFilter(method="filter_group")

    class Meta:
        model = Player
        fields = ["group__name"]

    @staticmethod
    def filter_group(queryset, name, value):
        try:
            return queryset.filter_and_annotate_for_group(value)
        except Group.DoesNotExist:
            return queryset
