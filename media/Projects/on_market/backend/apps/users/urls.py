from django.urls import path
from .views import api_login
from .views import api_register
from . import views

urlpatterns = [
    path('api/login/', api_login, name='api_login'),
    path('api/register/', api_register, name='api_register'),
    path('logout/', views.logout_view, name='logout'),
]
