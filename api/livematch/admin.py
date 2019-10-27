from django.contrib import admin
from .models import LiveMatch


@admin.register(LiveMatch)
class LiveMatchAdmin(admin.ModelAdmin):
    pass
