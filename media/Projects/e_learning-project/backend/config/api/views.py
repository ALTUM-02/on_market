from django.shortcuts import render

# Create your views here.
from rest_framework import viewsets, status, permissions
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.db.models import Q
from .models import UserProfile, Folder, UploadedFile, TextContent
from .serializers import (
    UserProfileSerializer, FolderSerializer,
    UploadedFileSerializer, TextContentSerializer
)
from authentication.serializers import UserSerializer, LoginSerializer, RegisterSerializer
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import BasePermission, IsAuthenticated

class IsOwnerOrReadOnly(permissions.BasePermission):
    """Custom permission to only allow owners to edit their objects"""
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.user == request.user

class IsAdminUserOnly(BasePermission):
    """Custom permission to only allow admin users"""
    def has_permission(self, request, view):
        return request.user.is_staff

@method_decorator(csrf_exempt, name='dispatch')
class AuthView(APIView):
    """Authentication endpoints"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Login user"""
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                login(request, user)
                refresh = RefreshToken.for_user(user)
                return Response({
                    'success': True,
                    'user': UserSerializer(user).data,
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                    'message': 'Login successful'
                })
            return Response({
                'success': False,
                'error': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class RegisterView(APIView):
    """User registration"""
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        """Register new user"""
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'success': True,
                'user': UserSerializer(user).data,
                'access': str(refresh.access_token),
                'refresh': str(refresh),
                'message': 'Registration successful'
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name='dispatch')
class LogoutView(APIView):
    """Logout endpoint"""
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({
            'success': True,
            'message': 'Logout successful'
        })


class MeView(APIView):
    """Current user info"""
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            return Response({
                'authenticated': True,
                'user': UserSerializer(request.user).data
            })
        return Response({
            'authenticated': False,
            'user': None
        })


@method_decorator(csrf_exempt, name='dispatch')
class FolderViewSet(viewsets.ModelViewSet):
    """ViewSet for Folder model"""
    serializer_class = FolderSerializer
    
    def get_queryset(self):
        return Folder.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@method_decorator(csrf_exempt, name='dispatch')
class UploadedFileViewSet(viewsets.ModelViewSet):
    """ViewSet for UploadedFile model"""
    queryset = UploadedFile.objects.all()
    serializer_class = UploadedFileSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    
    def get_permissions(self):
        
        if self.action in ["create", "update", "partial_update", "destroy"]:
            return [IsAdminUserOnly()]
        
        return [IsAuthenticated()]

    def get_queryset(self):
        return UploadedFile.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@method_decorator(csrf_exempt, name='dispatch')
class TextContentViewSet(viewsets.ModelViewSet):
    """ViewSet for TextContent model"""
    serializer_class = TextContentSerializer
    
    def get_queryset(self):
        return TextContent.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class DashboardView(APIView):
    """Dashboard data endpoint"""
    def get(self, request):
        if not request.user.is_authenticated:
            return Response({
                'authenticated': False
            }, status=status.HTTP_401_UNAUTHORIZED)
        
        folders = Folder.objects.filter(user=request.user)[:10]
        files = UploadedFile.objects.filter(user=request.user)[:10]
        texts = TextContent.objects.filter(user=request.user)[:10]
        
        return Response({
            'authenticated': True,
            'user': UserSerializer(request.user).data,
            'stats': {
                'total_folders': Folder.objects.filter(user=request.user).count(),
                'total_files': UploadedFile.objects.filter(user=request.user).count(),
                'total_texts': TextContent.objects.filter(user=request.user).count(),
            },
            'recent_folders': FolderSerializer(folders, many=True).data,
            'recent_files': UploadedFileSerializer(files, many=True, context={'request': request}).data,
            'recent_texts': TextContentSerializer(texts, many=True).data,
        })
