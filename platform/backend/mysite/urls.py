"""mysite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from api.views import *

from django.urls import path
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/xai/<str:challenge_id>/', xai_detail),
    path('api/score/<str:challenge_id>/', score_detail),
    path('api/dataset/<str:challenge_id>/', dataset_detail),
    path('api/mlmodel/<str:challenge_id>/', mlmodel_detail),
    path('api/xaimethod/<str:challenge_id>/', xaimethod_detail),
    path('api/challenge/create/', create_challenge), 
    path('challenge/form', challenge_form_view),  # New URL pattern for the form,
    path('success/', success_view, name='success'),
    path('api/challenge/<str:challenge_id>/', get_challenge),
    path('api/challenges/', get_challenges), 
    path('', include('user_api.urls')),
]