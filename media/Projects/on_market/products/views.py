from django.shortcuts import render, redirect
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Product
from .serializers import ProductSerializer
from django.contrib.auth.decorators import login_required
# views.py
from django.http import JsonResponse

@login_required
def add 

def home(request): 
    query = request.GET.get('q')
    
    if query:
        products = Product.objects.filter(name_incontains=query)
    else:
        products = Product.objects.all()     
    
    return render(request, 'pages/home.html', {"products": products, 'query': query})

# Create your views here.

class ProductViewSet(viewsets. ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminUser]
    

def product_detail(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return render(request, 'pages/404.html')  # custom page

    return render(request, 'pages/product_detail.html', {"product": product}) 


