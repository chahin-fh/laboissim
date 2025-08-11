"""
URL configuration for laboissim project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
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
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from rest_framework.routers import DefaultRouter
from .email_token_view import EmailTokenObtainPairView, GoogleLoginJWTView
from .views import GoogleOAuthCompleteView
from .views import CurrentUserView, SiteContentView


urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/email/', EmailTokenObtainPairView.as_view(), name='token_obtain_pair_email'),
    path('auth/', include('social_django.urls', namespace='social')),
    path('auth/google/jwt/', GoogleLoginJWTView.as_view(), name='google_login_jwt'),
    path('api/user/', CurrentUserView.as_view(), name='current-user'),
    path('api/site-content/', SiteContentView.as_view(), name='site-content'),
    path('auth/google/custom/', GoogleOAuthCompleteView.as_view(), name='google_oauth_custom'),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
