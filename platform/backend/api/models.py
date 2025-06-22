from django.db import models
from django.contrib.auth import get_user_model
import uuid

def challenge_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/CHALLENGE_ID/filename
    return f'{instance.challenge_id}/{filename}'

def challenge_path(instance: "Challenge", filename: str, prefix: str) -> str:
    """
    Example::
        media/challenges/1a2b3c/dataset/my_file.csv
    """
    safe_prefix = prefix.strip().lower()
    return f"challenges/{instance.challenge_id}/{safe_prefix}/{filename}"

def dataset_upload_path(instance, filename):
    return challenge_path(instance, filename, "dataset")

def model_upload_path(instance, filename):
    return challenge_path(instance, filename, "model")

def xai_upload_path(instance, filename):
    return challenge_path(instance, filename, "xai")

# Score Model - erweitert für EMD und IMA
class Score(models.Model):
    username = models.CharField(max_length=150)
    challenge_id = models.CharField(max_length=100)
    
    # Legacy field für Rückwärtskompatibilität
    score = models.FloatField(null=True, blank=True)  # Will be deprecated
    
    # Neue Score-Felder
    emd_score = models.FloatField(null=True, blank=True)
    emd_std = models.FloatField(null=True, blank=True)
    ima_score = models.FloatField(null=True, blank=True)
    ima_std = models.FloatField(null=True, blank=True)
    
    method_name = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Status tracking
    status = models.CharField(max_length=20, choices=[
        ('pending', 'Pending'),
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed')
    ], default='completed')  # Default completed für Rückwärtskompatibilität
    
    error_message = models.TextField(null=True, blank=True)
    
    def save(self, *args, **kwargs):
        # Wenn nur legacy score gesetzt ist, kopiere zu emd_score
        if self.score is not None and self.emd_score is None:
            self.emd_score = self.score
        # Wenn emd_score gesetzt ist, update legacy score
        elif self.emd_score is not None:
            self.score = self.emd_score
        super().save(*args, **kwargs)
    
    @property
    def primary_score(self):
        """Return primary score for leaderboard (EMD by default)."""
        return self.emd_score if self.emd_score is not None else self.score
    
    def __str__(self):
        scores_str = []
        if self.emd_score is not None:
            scores_str.append(f"EMD: {self.emd_score:.4f}")
        if self.ima_score is not None:
            scores_str.append(f"IMA: {self.ima_score:.4f}")
        if not scores_str and self.score is not None:
            scores_str.append(f"Score: {self.score:.4f}")
        
        score_display = " | ".join(scores_str) if scores_str else "No scores"
        return f"User {self.username} - Challenge {self.challenge_id} - {score_display}"

# Challenge model (bleibt unverändert)
class Challenge(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True, editable=False)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    
    # Uploads
    dataset = models.FileField(
        upload_to=dataset_upload_path,
        blank=True, null=True
    )
    mlmodel = models.FileField(
        upload_to=model_upload_path,
        blank=True, null=True
    )
    xaimethod = models.FileField(
        upload_to=xai_upload_path,
        blank=True, null=True
    )
    
    def save(self, *args, **kwargs):
        if not self.challenge_id:
            self.challenge_id = uuid.uuid4().hex
        super().save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.challenge_id} – {self.title}"