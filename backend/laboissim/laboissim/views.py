from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import HttpResponseRedirect
from django.contrib.auth import get_user_model
import json
from social_django.views import complete as social_complete
from django.shortcuts import redirect
from django.views import View

User = get_user_model()

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'is_staff': user.is_staff,
            'is_superuser': user.is_superuser,
        })

class SiteContentView(APIView):
    def get(self, request):
        # This would typically fetch content from your database
        return Response({
            'title': 'Laboissim',
            'description': 'Welcome to Laboissim',
            'content': 'This is the main content of the site.'
        })

class GoogleOAuthCompleteView(View):
    def get(self, request, *args, **kwargs):
        """Custom Google OAuth completion that redirects to frontend with JWT"""
        try:
            # Let social_django handle the OAuth completion
            response = social_complete(request, backend='google-oauth2')
            
            # Check if the user is now authenticated
            if request.user.is_authenticated:
                user = request.user
                refresh = RefreshToken.for_user(user)
                
                # Create user data for frontend
                user_data = {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                    'is_staff': user.is_staff,
                    'is_superuser': user.is_superuser,
                }
                
                # Encode user data and tokens for URL parameters
                import urllib.parse
                user_data_encoded = urllib.parse.quote(json.dumps(user_data))
                access_token_encoded = urllib.parse.quote(str(refresh.access_token))
                refresh_token_encoded = urllib.parse.quote(str(refresh))
                
                # Redirect to frontend with user data
                redirect_url = f"https://laboissim.vercel.app/login/google-callback?user={user_data_encoded}&access={access_token_encoded}&refresh={refresh_token_encoded}"
                return redirect(redirect_url)
            else:
                # If not authenticated, redirect to login with error
                return redirect("https://laboissim.vercel.app/login?error=google_auth_failed")
        except Exception as e:
            print(f"Google OAuth completion error: {e}")
            return redirect("https://laboissim.vercel.app/login?error=google_auth_failed") 