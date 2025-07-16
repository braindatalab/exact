from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from .models import UserProfile
from django.contrib.auth import logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, BasePermission
from django.utils import timezone
from .serializers import UserProfileSerializer
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
# from .validations import custom_validation, validate_email, validate_password


@method_decorator(csrf_exempt, name='dispatch')
class UserRegister(APIView):
	permission_classes = (permissions.AllowAny,)
	def post(self, request):
		# clean_data = custom_validation(request.data)
		clean_data = request.data
		print(clean_data)
		serializer = UserRegisterSerializer(data=clean_data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.create(clean_data)
			# Ensure UserProfile exists
			UserProfile.objects.get_or_create(user=user)
			if user:
				return Response(serializer.data, status=status.HTTP_201_CREATED)
		return Response(status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class UserLogin(APIView):
	permission_classes = (permissions.AllowAny,)
	authentication_classes = (SessionAuthentication,)
	##
	def post(self, request):
		data = request.data
		# assert validate_email(data)
		# assert validate_password(data)
		serializer = UserLoginSerializer(data=data)
		if serializer.is_valid(raise_exception=True):
			user = serializer.check_user(data)
			# Check approval
			try:
				if not user.profile.is_approved:
					return Response({'detail': 'pending_approval'}, status=status.HTTP_403_FORBIDDEN)
			except UserProfile.DoesNotExist:
				return Response({'detail': 'pending_approval'}, status=status.HTTP_403_FORBIDDEN)
			login(request, user)
			return Response(serializer.data, status=status.HTTP_200_OK) # Status nicht immer 200 


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
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)

class IsAdminUserStrict(BasePermission):
    def has_permission(self, request, view):
        return request.user.is_authenticated and request.user.username == 'admin'

# Admin API endpoints
@api_view(['GET'])
@permission_classes([IsAdminUserStrict])
def pending_users(request):
    profiles = UserProfile.objects.filter(is_approved=False, rejected_at__isnull=True)
    data = [
        {
            'id': p.user.id,
            'username': p.user.username,
            'email': p.user.email,
            'date_joined': p.user.date_joined,
            'profile': UserProfileSerializer(p).data
        }
        for p in profiles
    ]
    return Response(data)

@api_view(['POST'])
@permission_classes([IsAdminUserStrict])
def approve_user(request, user_id):
    try:
        profile = UserProfile.objects.get(user__id=user_id)
        if profile.is_approved:
            return Response({'status': 'already_approved'})
        profile.approve(request.user)
        return Response({'status': 'approved'})
    except UserProfile.DoesNotExist:
        return Response({'error': 'not found'}, status=404)

@api_view(['POST'])
@permission_classes([IsAdminUserStrict])
def reject_user(request, user_id):
    try:
        profile = UserProfile.objects.get(user__id=user_id)
        if not profile.is_approved and profile.rejected_at:
            return Response({'status': 'already_rejected'})
        profile.reject()
        return Response({'status': 'rejected'})
    except UserProfile.DoesNotExist:
        return Response({'error': 'not found'}, status=404)