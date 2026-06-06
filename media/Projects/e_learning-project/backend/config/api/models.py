from django.db import models

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    """Extended user profile"""
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    bio = models.TextField(blank=True, default='')
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.user.username}'s profile"


class Folder(models.Model):
    """User folders for organizing content"""
    name = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='folders')
    parent = models.ForeignKey('self', on_delete=models.CASCADE, null=True, blank=True, related_name='subfolders')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class UploadedFile(models.Model):
    """Model for uploaded files (images, animations, audio, video)"""
    FILE_TYPES = 
    
    FILE_TYPES = [
    ('image', 'Image'),
    ('animation', 'Animation'),
    ('audio', 'Audio'),
    ('video', 'Video'),
    ('pdf', 'PDF'),
    ]
    
    file_type = models.CharField(max_length=20, choices=FILE_TYPES)
    file = models.FileField(upload_to='uploads/')
    filename = models.CharField(max_length=255)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='uploaded_files')
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name='files')
    description = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.filename} ({self.file_type}) - {self.user.username}"


class TextContent(models.Model):
    """Model for text content with font options"""
    FONT_FAMILIES = [
        ('serif', 'Serif'),
        ('sans-serif', 'Sans Serif'),
    ]
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    font_family = models.CharField(max_length=20, choices=FONT_FAMILIES, default='serif')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='text_contents')
    folder = models.ForeignKey(Folder, on_delete=models.SET_NULL, null=True, blank=True, related_name='texts')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.title} - {self.user.username}"
