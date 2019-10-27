from django.contrib import admin
from .models import Match


@admin.register(Match)
class CoreAdmin(admin.ModelAdmin):
    pass
