from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import serializers, status
from .models import SiteContent

# Serializer for the User model
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'is_staff', 'is_superuser']

# Serializer for SiteContent
class SiteContentSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteContent
        fields = '__all__'

# API view to return and update the singleton SiteContent
class SiteContentView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        content, _ = SiteContent.objects.get_or_create(id=1)
        serializer = SiteContentSerializer(content)
        return Response(serializer.data)

    def put(self, request):
        if not request.user.is_staff:
            return Response({'detail': 'Not authorized.'}, status=status.HTTP_403_FORBIDDEN)
        content, _ = SiteContent.objects.get_or_create(id=1)
        serializer = SiteContentSerializer(content, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# API view to return the current user's data
class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data) 