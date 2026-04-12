from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Product
from .serializers import ProductSerializer
# views.py
from django.http import JsonResponse

def home(request): 
    products =[
        {"name": "Phone", "price": 100},
        {"name": "Laptop", "price": 500},
    ]
    
    return render(request, 'pages/home.html', {"products": products})

# Create your views here.

class ProductViewSet(viewsets. ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
