from rest_framework import serializers
from .models import *

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ['username', 'challenge_id', 'score', 'created_at']

class ChallengeSerializer(serializers.ModelSerializer):  
    class Meta:
        model = Challenge
        fields = '__all__'