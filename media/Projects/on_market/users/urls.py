from django.urls import path
from .views import api_login
from . import views

urlpatterns = [
    path('api/login/', api_login, name='api_login'),
    path('logout/', views.logout_view, name='logout'),
]
