from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
# from .validations import custom_validation, validate_email, validate_password


class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		# clean_data = custom_validation(request.data)
		clean_data = request.data
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid():
			user = serializer.create(clean_data)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response({'error': ' '.join([f"{k}: {v[0]}" for k, v in serializer.errors.items()])}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		# assert validate_email(data)
		# assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid():
			try:
				user = serializer.check_user(data)
			except KeyError:
				return Response({'error': 'Invalid username or password'}, status=status.HTTP_401_UNAUTHORIZED)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK)
		return Response({'error': ' '.join([f"{k}: {v[0]}" for k, v in serializer.errors.items()])}, status=status.HTTP_400_BAD_REQUEST) 


class UserLogout(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = ()
	def post(self, request):
		logout(request)
		return Response(status=status.HTTP_200_OK)


class UserView(APIView):
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		response = Response({'user': serializer.data}, status=status.HTTP_200_OK)
		response['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0'
		return response