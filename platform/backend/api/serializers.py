from rest_framework import serializers
from .models import *

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ["challenge_id", "score"]

class ChallengeSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Challenge
        fields = ['challenge_id', 'title', 'description', 'created_at', 'xaimethod', 'dataset', 'mlmodel']