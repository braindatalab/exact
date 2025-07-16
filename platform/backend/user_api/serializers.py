from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Company, UserProfile

UserModel = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    approved_by = serializers.SerializerMethodField()

    class Meta:
        model = UserProfile
        fields = ['is_approved', 'approved_at', 'approved_by', 'rejected_at']
        read_only_fields = fields

    def get_approved_by(self, obj):
        if obj.approved_by:
            return {
                'username': obj.approved_by.username,
                'email': obj.approved_by.email
            }
        return None

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
        # Create UserProfile (unapproved by default)
        UserProfile.objects.create(user=user_obj, is_approved=False, approved_at=None, approved_by=None, rejected_at=None)
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
    profile = UserProfileSerializer(read_only=True)
    class Meta:
        model = UserModel
        fields = ('email', 'username', 'company_name', 'profile')

class CompanySerializer(serializers.ModelSerializer):
    class Meta:
        model = Company
        fields = ['id', 'name', 'description', 'website', 'created_at']