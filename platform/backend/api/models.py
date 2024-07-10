from django.db import models
from django.contrib.postgres.fields import JSONField
import uuid 
from django.utils import timezone

def challenge_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/CHALLENGE_ID/filename
    return f'{instance.challenge_id}/{filename}'

# Score Model
class Score(models.Model):
    username = models.CharField(max_length=150) 
    challenge_id = models.CharField(max_length=100)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.username} - Challenge {self.challenge.challenge_id} - {self.score}"



# Challenge model 
class Challenge(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    mlmodel = models.FileField(upload_to=challenge_directory_path, default='default_mlmodel.txt' )
    dataset = models.FileField(upload_to=challenge_directory_path, default='default_dataset.txt') # 
    xaimethod = models.FileField(upload_to=challenge_directory_path, default='default_xaimethod.txt' )

    def save(self, *args, **kwargs):
        # Generate a unique challenge_id if it's not set
        if not self.challenge_id:
            self.challenge_id = uuid.uuid4().hex
        super().save(*args, **kwargs)