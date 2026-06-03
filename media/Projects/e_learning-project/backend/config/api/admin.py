from django.contrib import admin

# Register your models here.
from django.contrib import admin
from .models import UserProfile, Folder, UploadedFile, TextContent

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_at', 'updated_at']
    search_fields = ['user__username']

@admin.register(Folder)
class FolderAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'parent', 'created_at']
    list_filter = ['created_at']
    search_fields = ['name', 'user__username']

@admin.register(UploadedFile)
class UploadedFileAdmin(admin.ModelAdmin):
    list_display = ['filename', 'file_type', 'user', 'created_at']
    list_filter = ['file_type', 'created_at']
    search_fields = ['filename', 'user__username']

@admin.register(TextContent)
class TextContentAdmin(admin.ModelAdmin):
    list_display = ['title', 'font_family', 'user', 'created_at']
    list_filter = ['font_family', 'created_at']
    search_fields = ['title', 'content', 'user__username']
