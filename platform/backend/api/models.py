from django.db import models
from django.contrib.postgres.fields import JSONField

#XAI Method Model
class Xaimethod(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    xai_method_url = models.URLField(default='')  

    def __str__(self):
        return f'{self.pk} - {self.xai_method_url}'

# Score Model
class Score(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    score = models.FloatField()

    def __str__(self):
        return f"{self.pk} - {self.score}"

# Dataset Model
class Dataset(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    dataset_url = models.URLField(default='') 

    def __str__(self):
        return f"{self.pk} - {self.dataset_url}"

#ML Model
class Mlmodel(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    model_url = models.URLField(default='')  

    def __str__(self):
        return f"{self.pk} - {self}"

# Challenge model 
class Challenge(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True)
    title = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)