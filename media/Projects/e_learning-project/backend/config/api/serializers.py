from rest_framework import serializers
from django.contrib.auth.models import User
from .models import UserProfile, Folder, UploadedFile, TextContent


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model"""
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']
        read_only_fields = ['id']


class UserProfileSerializer(serializers.ModelSerializer):
    """Serializer for UserProfile model"""
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = UserProfile
        fields = ['id', 'user', 'bio', 'avatar', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class FolderSerializer(serializers.ModelSerializer):
    """Serializer for Folder model"""
    subfolders = serializers.SerializerMethodField()
    files_count = serializers.SerializerMethodField()
    texts_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Folder
        fields = ['id', 'name', 'parent', 'subfolders', 'files_count', 'texts_count', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_subfolders(self, obj):
        subfolders = obj.subfolders.all()[:5]
        return FolderSerializer(subfolders, many=True).data
    
    def get_files_count(self, obj):
        return obj.files.count()
    
    def get_texts_count(self, obj):
        return obj.texts.count()


class UploadedFileSerializer(serializers.ModelSerializer):
    """Serializer for UploadedFile model"""
    file_url = serializers.SerializerMethodField()
    
    class Meta:
        model = UploadedFile
        fields = ['id', 'file_type', 'file', 'file_url', 'filename', 'folder', 'description', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_file_url(self, obj):
        if obj.file:
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(obj.file.url)
        return None


class TextContentSerializer(serializers.ModelSerializer):
    """Serializer for TextContent model"""
    
    class Meta:
        model = TextContent
        fields = ['id', 'title', 'content', 'font_family', 'folder', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']


class LoginSerializer(serializers.Serializer):
    """Serializer for login"""
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)


class RegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration"""
    password = serializers.CharField(write_only=True)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'password_confirm', 'first_name', 'last_name']
    
    def validate(self, data):
        if data['password'] != data['password_confirm']:
            raise serializers.ValidationError("Passwords do not match")
        return data
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        UserProfile.objects.create(user=user)
        return user
