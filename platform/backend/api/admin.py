from django.contrib import admin
from .models import Score, Challenge

@admin.register(Score)
class ScoreAdmin(admin.ModelAdmin):
    list_display = ('username', 'challenge_id', 'score', 'created_at')
    list_filter = ('username', 'challenge_id')
    search_fields = ('username', 'challenge_id')
    ordering = ('-created_at',)

@admin.register(Challenge)
class ChallengeAdmin(admin.ModelAdmin):
    list_display = ('challenge_id', 'title', 'created_at')
    list_filter = ('created_at',)
    search_fields = ('challenge_id', 'title', 'description')
    ordering = ('-created_at',)
