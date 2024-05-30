from rest_framework import serializers
from .models import *


class XaimethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = Xaimethod
        fields = ["challenge_id", "xai_method_url"]


class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = ["challenge_id", "score"]


class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ["challenge_id", "dataset_url"]


class MlmodelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mlmodel
        fields = ["challenge_id", 'model_url']

class ChallengeSerializer(serializers.ModelSerializer):
    xai_method_url = serializers.SerializerMethodField()
    dataset_url = serializers.SerializerMethodField()
    mlmodel_url = serializers.SerializerMethodField()
    
    class Meta:
        model = Challenge
        fields = ['challenge_id', 'title', 'description', 'created_at', 'xai_method_url', 'dataset_url', 'mlmodel_url']

    # fetch the url's based on challenge_id 
    def get_xai_method_url(self, obj):
        xai_method = Xaimethod.objects.filter(challenge_id=obj.challenge_id).first()
        return xai_method.xai_method_url if xai_method else None
    
    def get_dataset_url(self, obj):
        dataset = Dataset.objects.filter(challenge_id=obj.challenge_id).first()
        return dataset.dataset_url if dataset else None
    
    def get_mlmodel_url(self, obj):
        mlmodel = Mlmodel.objects.filter(challenge_id=obj.challenge_id).first()
        return mlmodel.model_url if mlmodel else None