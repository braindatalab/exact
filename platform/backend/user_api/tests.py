from django.test import TestCase
from django.contrib.auth.models import User
from .models import UserProfile
from rest_framework.test import APIClient
from django.urls import reverse

# Create your tests here.

class UserApprovalTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.admin = User.objects.create_superuser('admin', 'admin@example.com', 'adminpass')
        self.user = User.objects.create_user('testuser', 'test@example.com', 'testpass')
        self.profile = UserProfile.objects.create(user=self.user)

    def test_user_profile_created(self):
        self.assertFalse(self.profile.is_approved)
        self.assertIsNone(self.profile.approved_at)

    def test_login_blocked_for_unapproved(self):
        response = self.client.post(reverse('login'), {'username': 'testuser', 'email': 'test@example.com', 'password': 'testpass'}, format='json')
        self.assertEqual(response.status_code, 403)
        self.assertEqual(response.data['detail'], 'pending_approval')

    def test_admin_can_approve_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse('approve_user', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.is_approved)
        self.assertIsNotNone(self.profile.approved_at)
        self.assertEqual(self.profile.approved_by, self.admin)

    def test_admin_can_reject_user(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.post(reverse('reject_user', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.profile.refresh_from_db()
        self.assertFalse(self.profile.is_approved)
        self.assertIsNotNone(self.profile.rejected_at)

    def test_pending_users_list(self):
        self.client.force_authenticate(user=self.admin)
        response = self.client.get(reverse('pending_users'))
        self.assertEqual(response.status_code, 200)
        self.assertTrue(any(u['username'] == 'testuser' for u in response.data))

    def test_double_approval(self):
        """Approving an already approved user should return already_approved."""
        self.client.force_authenticate(user=self.admin)
        # Approve once
        self.client.post(reverse('approve_user', args=[self.user.id]))
        # Approve again
        response = self.client.post(reverse('approve_user', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'already_approved')

    def test_double_rejection(self):
        """Rejecting an already rejected user should return already_rejected."""
        self.client.force_authenticate(user=self.admin)
        # Reject once
        self.client.post(reverse('reject_user', args=[self.user.id]))
        # Reject again
        response = self.client.post(reverse('reject_user', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['status'], 'already_rejected')

    def test_reapprove_after_rejection(self):
        """A rejected user can be re-approved."""
        self.client.force_authenticate(user=self.admin)
        self.client.post(reverse('reject_user', args=[self.user.id]))
        response = self.client.post(reverse('approve_user', args=[self.user.id]))
        self.assertEqual(response.status_code, 200)
        self.profile.refresh_from_db()
        self.assertTrue(self.profile.is_approved)
        self.assertIsNone(self.profile.rejected_at)  # Should be cleared on approval

    def test_admin_is_approved_on_startup(self):
        """Admin user should be approved on startup."""
        admin_profile, _ = UserProfile.objects.get_or_create(user=self.admin)
        self.assertTrue(admin_profile.is_approved)
