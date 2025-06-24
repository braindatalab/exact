from django.db import models
from django.db import models
from django.contrib.auth.models import User

# Company model
# This model represents a company associated with a user.
# It includes fields for the company name, description, website, and a one-to-one relationship
class Company(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name_plural = "Companies"
    
    def __str__(self):
        return self.name