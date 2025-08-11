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
from social_django.views import auth as social_auth
from django.contrib.auth import login
from social_core.backends.google import GoogleOAuth2
from django.conf import settings
import requests

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

class SimpleGoogleOAuthView(View):
    def get(self, request, *args, **kwargs):
        """Simple Google OAuth view that handles the entire flow"""
        print(f"SimpleGoogleOAuthView called with GET params: {request.GET}")
        
        # Check if we have an authorization code
        code = request.GET.get('code')
        
        if not code:
            # Redirect to Google OAuth
            google_oauth_url = (
                "https://accounts.google.com/o/oauth2/v2/auth?"
                "client_id=" + settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY + "&"
                "redirect_uri=https://laboissim.onrender.com/auth/complete/google-oauth2/&"
                "scope=email profile&"
                "response_type=code&"
                "access_type=offline&"
                "prompt=consent"
            )
            return redirect(google_oauth_url)
        
        try:
            # Exchange code for tokens
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': 'https://laboissim.onrender.com/auth/complete/google-oauth2/'
            }
            
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            
            # Get user info
            user_info_url = "https://www.googleapis.com/oauth2/v2/userinfo"
            headers = {'Authorization': f"Bearer {tokens['access_token']}"}
            user_response = requests.get(user_info_url, headers=headers)
            user_response.raise_for_status()
            user_info = user_response.json()
            
            # Find or create user
            email = user_info['email']
            try:
                user = User.objects.get(email=email)
            except User.DoesNotExist:
                # Create new user
                user = User.objects.create_user(
                    username=email,
                    email=email,
                    first_name=user_info.get('given_name', ''),
                    last_name=user_info.get('family_name', ''),
                    password=None  # No password for OAuth users
                )
            
            # Generate JWT tokens
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
            
        except Exception as e:
            print(f"Simple Google OAuth error: {e}")
            return redirect("https://laboissim.vercel.app/login?error=google_auth_failed")

class InterceptSocialAuthView(View):
    def get(self, request, *args, **kwargs):
        """Intercept social auth URLs and redirect to our custom flow"""
        print(f"InterceptSocialAuthView called with path: {request.path}")
        print(f"GET params: {request.GET}")
        
        # Redirect to our simple OAuth flow
        return redirect('/auth/google/simple/')

class CustomGoogleOAuthView(View):
    def get(self, request, *args, **kwargs):
        """Custom Google OAuth view that handles state parameter properly"""
        try:
            # Generate a state parameter if not present
            if 'state' not in request.GET:
                import secrets
                state = secrets.token_urlsafe(32)
                # Store state in session
                request.session['oauth_state'] = state
                # Redirect with state parameter
                return redirect(f"{request.path}?{request.GET.urlencode()}&state={state}")
            
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