from django.db import models
from django.contrib.auth import get_user_model   # statt username=CharField
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

# Score Model
class Score(models.Model):
    username = models.CharField(max_length=150) 
    challenge_id = models.CharField(max_length=100)
    score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.username} - Challenge {self.challenge.challenge_id} - {self.score}"



# Challenge model 
# class Challenge(models.Model):
#     challenge_id = models.CharField(max_length=100, unique=True)
#     title = models.CharField(max_length=100)
#     description = models.TextField()
#     created_at = models.DateTimeField(auto_now_add=True)
#     mlmodel = models.FileField(upload_to=challenge_directory_path, default='default_mlmodel.txt' )
#     dataset = models.FileField(upload_to=challenge_directory_path, default='default_dataset.txt') # 
#     xaimethod = models.FileField(upload_to=challenge_directory_path, default='default_xaimethod.txt' )

#     def save(self, *args, **kwargs):
#         # Generate a unique challenge_id if it's not set
#         if not self.challenge_id:
#             self.challenge_id = uuid.uuid4().hex
#         super().save(*args, **kwargs)

class Challenge(models.Model):
    challenge_id = models.CharField(max_length=100, unique=True, editable=False)
    title        = models.CharField(max_length=100)
    description  = models.TextField()
    created_at   = models.DateTimeField(auto_now_add=True)
    creator      = models.CharField(max_length=150, null=True, blank=True)

    # Uploads ---------------------------------------
    dataset   = models.FileField(
        upload_to=dataset_upload_path,
        blank=True, null=True
    )
    mlmodel   = models.FileField(
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


# Challenge-Uploads schnell prüfen  (CHID anpassen!)

# 1) Container laufen lassen
# docker compose up -d

# 2) Pfade der drei Dateien in der DB anzeigen
# CHID="306d8f9c-2f6a-4a84-be42-40fe30272b28"
# docker compose exec db psql -U postgres -d example \
#   -c "SELECT dataset, mlmodel, xaimethod FROM api_challenge WHERE challenge_id = '$CHID';"

# 3) Liegen die Dateien im Container?
# docker compose exec backend bash -c \
#   "ls -l /app/mysite/media/challenges/$CHID/{dataset,model,xai}"

# 4) …und auch auf dem Host (nur wenn Volume ./media gemountet ist)?
# dir .\media\challenges\$CHID\dataset
# dir .\media\challenges\$CHID\model
# dir .\media\challenges\$CHID\xai
