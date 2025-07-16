from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

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

# Restore UserProfile to pre-admin-approval state (if it existed)
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    is_approved = models.BooleanField(default=False)
    approved_at = models.DateTimeField(null=True, blank=True)
    approved_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='approved_users')
    rejected_at = models.DateTimeField(null=True, blank=True)

    def approve(self, admin_user):
        """Approve this user profile."""
        self.is_approved = True
        self.approved_at = timezone.now()
        self.approved_by = admin_user
        self.rejected_at = None
        self.save()

    def reject(self):
        """Reject this user profile."""
        self.is_approved = False
        self.rejected_at = timezone.now()
        self.save()

    def __str__(self):
        return f"Profile for {self.user.username}"