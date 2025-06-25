from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Company

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    company = serializers.CharField(max_length=200, required=False, write_only=True)
    
    class Meta:
        model = UserModel
        fields = ('username', 'email', 'password', 'company')
        extra_kwargs = {'password': {'write_only': True}}
    
    def validate(self, data):
        """
        NEU: Fügt eine benutzerdefinierte Validierung hinzu, um spezifische Fehlermeldungen zu geben.
        """
        # Prüfen, ob der Benutzername bereits existiert
        if UserModel.objects.filter(username=data['username']).exists():
            raise serializers.ValidationError({'error': 'A user with that username already exists.'})
        
        # Prüfen, ob die E-Mail bereits existiert
        if UserModel.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError({'error': 'A user with that email already exists.'})
            
        return data

    def create(self, validated_data):
        company_name = validated_data.pop('company', '')
        user_obj = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        
        if company_name and company_name.strip():
            try:
                Company.objects.create(user=user_obj, name=company_name)
            except Exception as e:
                print(f"Company creation failed: {e}")
        
        return user_obj

# --- Die anderen Serializer bleiben unverändert ---

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField()
    
    def check_user(self, clean_data):
        user = authenticate(username=clean_data['username'], password=clean_data['password'])
        if not user:
            raise KeyError('user not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(source='company.name', read_only=True)
    
    class Meta:
        model = UserModel
        fields = ('email', 'username', 'company_name')

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website', 'created_at']