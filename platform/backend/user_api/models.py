# Create your models here.
from django.db import models
from django.conf import settings

class Company(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        primary_key=True,
        related_name='company'
    )
    name = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return "%s the organization" % getattr(self.user, 'name', self.user.username)