"""
Django settings for mysite project.

Generated by 'django-admin startproject' using Django 2.2.5.

For more information on this file, see
https://docs.djangoproject.com/en/2.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/2.2/ref/settings/
"""

import os
from dotenv import find_dotenv, load_dotenv

load_dotenv(find_dotenv())

# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/2.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'ad=oz18m-6s-32i=yk6jm6^3u15ue*g&o6uqciymkcijrglzmu'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ['*']

# CORS Settings - Cross-Origin Resource Sharing for frontend communication
CORS_ALLOWED_ORIGINS = [
  'http://localhost:3000',   # Next.js development server
  'http://127.0.0.1:3000'    # Alternative localhost format
]

CORS_ALLOW_CREDENTIALS = True  # Essential for session-based authentication

# CSRF Settings - Cross-Site Request Forgery protection
CSRF_TRUSTED_ORIGINS = [
    'http://localhost:3000',  # Frontend development server
    'http://127.0.0.1:3000'   # Alternative localhost format
]

CSRF_COOKIE_HTTPONLY = False  # Allows JavaScript to read CSRF token for API requests
CSRF_COOKIE_SAMESITE = 'Lax'  # Balanced security - prevents CSRF while allowing normal navigation


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'api',
    'corsheaders',
    'rest_framework',
    'user_api.apps.UserApiConfig',
    'storages'
]

MIDDLEWARE = [
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'mysite.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'mysite.wsgi.application'


# Database
# https://docs.djangoproject.com/en/2.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE'),
        'NAME': os.getenv('DB_NAME'),
        'USER': os.getenv('DB_USER'),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/2.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/2.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = False

USE_L10N = False

USE_TZ = False


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/2.2/howto/static-files/

# Define the base directory for media uploads
MEDIA_ROOT = os.path.join(BASE_DIR, 'mysite/media')

# Define the URL prefix to use for media files

DEFAULT_FILE_STORAGE = 'django.core.files.storage.FileSystemStorage'

MEDIA_URL = '/media/'

STATIC_URL = '/static/'

# Session Configuration
# These settings are essential for user authentication and session management
SESSION_COOKIE_AGE = 86400  # 24 hours - How long sessions last before expiring
SESSION_COOKIE_SECURE = False  # Set to True in production with HTTPS - Controls if cookie sent over HTTPS only
SESSION_COOKIE_HTTPONLY = True  # Prevents JavaScript access to session cookie (XSS protection)
SESSION_COOKIE_SAMESITE = 'Lax'  # CSRF protection - prevents cross-site request inclusion
SESSION_COOKIE_PATH = '/'  # Cookie available for entire domain
SESSION_COOKIE_DOMAIN = None  # Use default domain - allows flexibility across environments
SESSION_SAVE_EVERY_REQUEST = True  # Updates session expiry on each request to keep active users logged in
SESSION_EXPIRE_AT_BROWSER_CLOSE = False  # Sessions persist after browser close (within AGE limit)

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': [
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.TokenAuthentication',
    ]
}