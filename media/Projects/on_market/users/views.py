from django.shortcuts import render

# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
# views.py
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to On Market API"})

@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
        username=request.data['username']
        password=request.data['password']
    )
    return Response({"message": "User created"})