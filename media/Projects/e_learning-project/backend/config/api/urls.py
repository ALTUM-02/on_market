from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    AuthView, RegisterView, LogoutView, MeView, DashboardView,
    FolderViewSet, UploadedFileViewSet, TextContentViewSet
)

router = DefaultRouter()
router.register(r'folders', FolderViewSet, basename='folder')
router.register(r'files', UploadedFileViewSet, basename='file')
router.register(r'texts', TextContentViewSet, basename='text')

urlpatterns = [
    path('auth/login/', AuthView.as_view(), name='login'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/logout/', LogoutView.as_view(), name='logout'),
    path('auth/me/', MeView.as_view(), name='me'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('', include(router.urls)),
]
