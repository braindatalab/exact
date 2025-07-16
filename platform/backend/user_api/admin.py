from django.contrib import admin
from .models import Company, UserProfile

@admin.register(Company)
class CompanyAdmin(admin.ModelAdmin):
    list_display = ('name', 'user', 'created_at')
    search_fields = ('name', 'user__username')

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'is_approved', 'approved_at', 'approved_by', 'rejected_at')
    list_filter = ('is_approved', 'approved_at', 'rejected_at')
    search_fields = ('user__username', 'user__email')
