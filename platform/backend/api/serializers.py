from rest_framework import serializers
from .models import Score, Challenge

class ScoreSerializer(serializers.ModelSerializer):
    # Make new fields optional for backward compatibility
    emd_score = serializers.FloatField(required=False, allow_null=True)
    emd_std = serializers.FloatField(required=False, allow_null=True)
    ima_score = serializers.FloatField(required=False, allow_null=True)
    ima_std = serializers.FloatField(required=False, allow_null=True)
    
    score = serializers.FloatField(required=False, allow_null=True)
    
    primary_score = serializers.ReadOnlyField()
    
    class Meta:
        model = Score
        fields = [
            'id', 
            'username', 
            'challenge_id', 
            'score',  
            'emd_score', 
            'emd_std', 
            'ima_score', 
            'ima_std',
            'primary_score',
            'method_name', 
            'created_at',
            'status',
            'error_message'
        ]
        read_only_fields = ['created_at', 'primary_score']
    
    def validate(self, data):
        """Ensure at least one score is provided."""
        if not any(data.get(field) is not None for field in ['score', 'emd_score', 'ima_score']):
            raise serializers.ValidationError("At least one score must be provided.")
        return data

class ChallengeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Challenge
        fields = [
            'challenge_id',
            'title',
            'description',
            'created_at',
            'created_by',
            'closes_on',
            'participant_count',
            'dataset',
            'mlmodel',
            'xaimethod'
        ]
        read_only_fields = ['challenge_id', 'created_at', 'participant_count']