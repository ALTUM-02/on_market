from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
# Create your views here.

from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
# views.py
from django.http import JsonResponse
import json

def home(request):
    return JsonResponse({"message": "Welcome to On Market API"})

@api_view(['POST'])
def register(request):
    user = User.objects.create_user(
        username=request.data['username'],
        password=request.data['password']
    )
    return Response({"message": "User created"})

def api_login(request):
    if request.method == "POST":
        data = json.loads(request.body)
        
        username = data.get("username")
        password = data.get("password")
        
        user = authenticate(request, username=username, password=password)
        
        if user:
            login(request, user)
            return JsonResponse({
                "status": "success",
                "message": "Login successful"
            })
        else:
            return JsonResponse({
                ""
            })    
            

def login_view(request):
    if request.method == 'POST':
        username = request.POST['username']
        password = request.POST['password']
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return redirect('/')
        else:
            return render(request, 'login.html', {'error': 'Invalid creditials'})
    
    return render(request, 'login.html')   
 
def logout_view(request):
    logout(request)
    return redirect('/')