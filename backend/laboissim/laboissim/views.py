from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
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
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework import permissions
from rest_framework import serializers, status , viewsets
from rest_framework.decorators import api_view, permission_classes, action
from django.db import transaction
from .models import SiteContent, UserProfile, Project, ProjectDocument
from django.db import models
from rest_framework.exceptions import PermissionDenied
User = get_user_model()
class SimpleGoogleOAuthView(View):
    def get(self, request, *args, **kwargs):
        """Simple Google OAuth view that handles the entire flow"""
        print(f"SimpleGoogleOAuthView called with GET params: {request.GET}")
        
        # Check if we have an authorization code
        code = request.GET.get('code')
        
        if not code:
            # Get the current domain for the redirect URI
            if request.is_secure():
                domain = f"https://{request.get_host()}"
            else:
                domain = f"http://{request.get_host()}"
            
            # Use the correct redirect URI based on the current domain
            redirect_uri = f"{domain}/auth/complete/google-oauth2/"
            
            # Redirect to Google OAuth
            google_oauth_url = (
                "https://accounts.google.com/o/oauth2/v2/auth?"
                "client_id=" + settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY + "&"
                "redirect_uri=" + redirect_uri + "&"
                "scope=email profile&"
                "response_type=code&"
                "access_type=offline&"
                "prompt=consent"
            )
            return redirect(google_oauth_url)
        
        try:
            # Get the current domain for the redirect URI
            if request.is_secure():
                domain = f"https://{request.get_host()}"
            else:
                domain = f"http://{request.get_host()}"
            
            redirect_uri = f"{domain}/auth/complete/google-oauth2/"
            
            # Exchange code for tokens
            token_url = "https://oauth2.googleapis.com/token"
            token_data = {
                'client_id': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_KEY,
                'client_secret': settings.SOCIAL_AUTH_GOOGLE_OAUTH2_SECRET,
                'code': code,
                'grant_type': 'authorization_code',
                'redirect_uri': redirect_uri
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

# API view to return the current user's data
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ExtendedUserSerializer(request.user)
        return Response(serializer.data)
# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined']

# Serializer for UserProfile model
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['phone', 'bio', 'profile_image', 'location', 'institution', 'website', 'linkedin', 'twitter', 'github']

# Extended User Serializer with profile data
class ExtendedUserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    full_name = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser', 'date_joined', 'profile', 'full_name']
    
    def get_full_name(self, obj):
        return obj.profile.full_name if hasattr(obj, 'profile') else f"{obj.first_name} {obj.last_name}".strip() or obj.username

# Serializer for the SiteContent
class SiteContentSerializer(serializers.ModelSerializer):
    logo_image = serializers.ImageField(required=False, allow_null=True, allow_empty_file=True)
    
    class Meta:
        model = SiteContent
        fields = '__all__'
        extra_kwargs = {
            'logo_image': {'required': False, 'allow_null': True}
        }

# API view to return and update the singleton SiteContent
class SiteContentView(APIView):
    # Public can GET, only staff can PUT (enforced below)
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        content, _ = SiteContent.objects.get_or_create(id=1)
        serializer = SiteContentSerializer(content)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        
        # Debug: log what we're receiving
        print(f"logo_image in files: {'logo_image' in request.FILES}")
        
        content, _ = SiteContent.objects.get_or_create(id=1)
        serializer = SiteContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        print(f"Serializer errors: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to return the current user's data
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = ExtendedUserSerializer(request.user)
        return Response(serializer.data)

# API view to get all team members
class TeamMembersView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        """Get all team members with their profiles"""
        users = User.objects.filter(is_active=True).prefetch_related('profile')
        serializer = ExtendedUserSerializer(users, many=True)
        return Response(serializer.data)

# API view to get all users (for admin purposes)
class UsersView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        """Get all users for admin purposes"""
        users = User.objects.select_related('profile').all()
        users_data = []
        
        for user in users:
            user_data = {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
                'is_staff': user.is_staff,
                'is_superuser': user.is_superuser,
                'is_active': user.is_active,
                'date_joined': user.date_joined,
                'role': user.profile.role if hasattr(user, 'profile') and user.profile else 'member',
                'verified': False,  # Default to False since UserProfile doesn't have verified field
            }
            users_data.append(user_data)
        
        return Response(users_data)

# API view to update user profile
class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get(self, request):
        """Get current user's profile"""
        try:
            profile = request.user.profile
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)
        except UserProfile.DoesNotExist:
            # Create profile if it doesn't exist
            profile = UserProfile.objects.create(user=request.user)
            serializer = UserProfileSerializer(profile)
            return Response(serializer.data)

    def put(self, request):
        """Update current user's profile"""
        try:
            profile = request.user.profile
        except UserProfile.DoesNotExist:
            profile = UserProfile.objects.create(user=request.user)
        
        # Handle file upload for profile image
        if 'profile_image' in request.FILES:
            profile.profile_image = request.FILES['profile_image']
        
        # Handle other fields
        data = request.data.copy()
        if 'profile_image' in data:
            del data['profile_image']  # Remove from data since we handled it above
        
        serializer = UserProfileSerializer(profile, data=data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def patch(self, request):
        """Partial update of current user's profile"""
        return self.put(request) 

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def update_user_role(request, user_id):
    try:
        user_id_int = int(user_id)
        target_user = User.objects.get(id=user_id_int)
    except (User.DoesNotExist, ValueError):
        return Response(
            {"error": "Utilisateur non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )

    new_role = request.data.get('role')
    if new_role not in ['member', 'admin', 'chef_d_equipe']:
        return Response(
            {"error": "Rôle spécifié invalide."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Get or create the user profile
    user_profile, created = UserProfile.objects.get_or_create(user=target_user)

    # Update flags based on the role
    try:
        if new_role == 'admin':
            target_user.is_staff = True
            target_user.is_superuser = False  # Changed: Avoid granting superuser unless necessary
        elif new_role == 'chef_d_equipe':
            target_user.is_staff = False
            target_user.is_superuser = False
        else:  # 'member'
            target_user.is_staff = False
            target_user.is_superuser = False

        with transaction.atomic():
            user_profile.role = new_role
            target_user.save()
            user_profile.save()

        serializer = ExtendedUserSerializer(target_user)
        return Response({
            "message": f"Rôle de l'utilisateur mis à jour vers '{new_role}' avec succès.",
            "user": serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error updating user {user_id} role to {new_role}: {str(e)}")
        return Response(
            {"error": f"Erreur lors de la mise à jour du rôle: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def ban_user(request, user_id):
    """Ban a user (set is_active to False)"""
    try:
        user_id_int = int(user_id)
        target_user = User.objects.get(id=user_id_int)
    except (User.DoesNotExist, ValueError):
        return Response(
            {"error": "Utilisateur non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Prevent admin from banning themselves
    if target_user.id == request.user.id:
        return Response(
            {"error": "Vous ne pouvez pas vous bannir vous-même."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        target_user.is_active = False
        target_user.save()
        
        serializer = ExtendedUserSerializer(target_user)
        return Response({
            "message": f"Utilisateur {target_user.username} a été banni avec succès.",
            "user": serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error banning user {user_id}: {str(e)}")
        return Response(
            {"error": f"Erreur lors du bannissement: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated, IsAdminUser])
def unban_user(request, user_id):
    """Unban a user (set is_active to True)"""
    try:
        user_id_int = int(user_id)
        target_user = User.objects.get(id=user_id_int)
    except (User.DoesNotExist, ValueError):
        return Response(
            {"error": "Utilisateur non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        target_user.is_active = True
        target_user.save()
        
        serializer = ExtendedUserSerializer(target_user)
        return Response({
            "message": f"Utilisateur {target_user.username} a été débanni avec succès.",
            "user": serializer.data
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error unbanning user {user_id}: {str(e)}")
        return Response(
            {"error": f"Erreur lors du débannissement: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['DELETE'])
@permission_classes([IsAuthenticated, IsAdminUser])
def delete_user(request, user_id):
    """Delete a user permanently"""
    try:
        user_id_int = int(user_id)
        target_user = User.objects.get(id=user_id_int)
    except (User.DoesNotExist, ValueError):
        return Response(
            {"error": "Utilisateur non trouvé."},
            status=status.HTTP_404_NOT_FOUND
        )

    # Prevent admin from deleting themselves
    if target_user.id == request.user.id:
        return Response(
            {"error": "Vous ne pouvez pas supprimer votre propre compte."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        username = target_user.username
        target_user.delete()
        
        return Response({
            "message": f"Utilisateur {username} a été supprimé avec succès."
        }, status=status.HTTP_200_OK)

    except Exception as e:
        import logging
        logger = logging.getLogger(__name__)
        logger.error(f"Error deleting user {user_id}: {str(e)}")
        return Response(
            {"error": f"Erreur lors de la suppression: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Project Serializers
class ProjectDocumentSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.CharField(source='uploaded_by.get_full_name', read_only=True)
    
    class Meta:
        model = ProjectDocument
        fields = ['id', 'name', 'file', 'uploaded_by', 'uploaded_by_name', 'uploaded_at', 'file_type', 'size', 'project']
        read_only_fields = ['uploaded_by', 'uploaded_at', 'file_type', 'size', 'project']

class ProjectSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source='created_by.get_full_name', read_only=True)
    team_members_names = serializers.SerializerMethodField()
    documents = ProjectDocumentSerializer(many=True, read_only=True)
    documents_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'description', 'image', 'status', 'priority', 
            'start_date', 'end_date', 'created_by', 'created_by_name',
            'team_members', 'team_members_names', 'created_at', 'updated_at',
            'documents', 'documents_count'
        ]
        read_only_fields = ['created_by', 'created_at', 'updated_at']
    
    def get_team_members_names(self, obj):
        return [f"{member.first_name} {member.last_name}".strip() or member.username for member in obj.team_members.all()]
    
    def get_documents_count(self, obj):
        return obj.documents.count()

# Project Viewsets
class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        """
        Allow public access to list and retrieve projects,
        but require authentication for create, update, and delete operations.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        if self.action in ['list', 'retrieve']:
            # Public access: return all projects
            return Project.objects.all().order_by('-created_at')
        else:
            # Authenticated access: users can see projects they created or are team members of
            user = self.request.user
            return Project.objects.filter(
                models.Q(created_by=user) | models.Q(team_members=user)
            ).distinct()
    
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['post'])
    def add_team_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            project.team_members.add(user)
            return Response({'message': 'Team member added successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
    
    @action(detail=True, methods=['post'])
    def remove_team_member(self, request, pk=None):
        project = self.get_object()
        user_id = request.data.get('user_id')
        
        if not user_id:
            return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            user = User.objects.get(id=user_id)
            project.team_members.remove(user)
            return Response({'message': 'Team member removed successfully'}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

class ProjectDocumentViewSet(viewsets.ModelViewSet):
    queryset = ProjectDocument.objects.all()
    serializer_class = ProjectDocumentSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        """
        Allow public access to list and retrieve project documents,
        but require authentication for create, update, and delete operations.
        """
        if self.action in ['list', 'retrieve']:
            permission_classes = [permissions.AllowAny]
        else:
            permission_classes = [permissions.IsAuthenticated]
        return [permission() for permission in permission_classes]
    
    def get_queryset(self):
        project_id = self.request.query_params.get('project_id')
        if project_id:
            return ProjectDocument.objects.filter(project_id=project_id)
        return ProjectDocument.objects.none()
    
    def perform_create(self, serializer):
        project_id = self.request.data.get('project_id')
        if not project_id:
            raise serializers.ValidationError('project_id is required')
        
        try:
            project = Project.objects.get(id=project_id)
            # Check if user has access to this project
            if project.created_by != self.request.user and self.request.user not in project.team_members.all():
                raise PermissionDenied("You don't have permission to add documents to this project")
            
            uploaded_file = self.request.FILES.get('file')
            file_size = getattr(uploaded_file, 'size', 0) if uploaded_file else 0
            file_type = getattr(uploaded_file, 'content_type', '') if uploaded_file else ''
            
            serializer.save(
                uploaded_by=self.request.user,
                project=project,
                size=file_size,
                file_type=file_type,
            )
        except Project.DoesNotExist:
            raise serializers.ValidationError('Project not found')
