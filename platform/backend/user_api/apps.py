from django.apps import AppConfig
from django.db.utils import OperationalError

def create_default_admin():
    try:
        from django.contrib.auth.models import User
        from .models import UserProfile, Company
        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@admin.com',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        if created:
            admin_user.set_password('admin')
            admin_user.save()
        profile, _ = UserProfile.objects.get_or_create(user=admin_user)
        if not profile.is_approved:
            profile.is_approved = True
            profile.save()
        # Ensure admin company exists
        Company.objects.get_or_create(user=admin_user, name='admin')
    except OperationalError:
        pass

class UserApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'user_api'

    def ready(self):
        create_default_admin()
