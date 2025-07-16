from django.urls import path
from . import views

urlpatterns = [
	path('register', views.UserRegister.as_view(), name='register'),
	path('login', views.UserLogin.as_view(), name='login'),
	path('logout', views.UserLogout.as_view(), name='logout'),
	path('user', views.UserView.as_view(), name='user'),
	# Admin approval endpoints
	path('admin/pending-users/', views.pending_users, name='pending_users'),
	path('admin/approve-user/<int:user_id>/', views.approve_user, name='approve_user'),
	path('admin/reject-user/<int:user_id>/', views.reject_user, name='reject_user'),
]