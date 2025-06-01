from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from .models import Company

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = '__all__'

	def create(self, clean_data):
		company_name = clean_data.get('company', '')
		user_obj = UserModel.objects.create_user(username=clean_data['username'], email=clean_data['email'], password=clean_data['password'])
		user_obj.username = clean_data['username']
		user_obj.save()

		Company.objects.create(user=user_obj, name=company_name) 
		return user_obj

class UserLoginSerializer(serializers.Serializer):
	email = serializers.EmailField()
	username = serializers.CharField()
	password = serializers.CharField()
	##
	def check_user(self, clean_data):
		user = authenticate(username=clean_data['username'], password=clean_data['password'])
		if not user:
			raise KeyError('user not found')
		return user

class UserSerializer(serializers.ModelSerializer):
	class Meta:
		model = UserModel
		fields = ('email', 'username')
