from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Product
from .serializers import ProductSerializer
# views.py
from django.http import JsonResponse

def home(request):
    return JsonResponse({"message": "Welcome to On Market API"})

# Create your views here.

class ProductViewSet(viewsets. ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
