from django.shortcuts import render, redirect
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Product
from .serializers import ProductSerializer
from django.contrib.auth.decorators import login_required
# views.py
from django.http import JsonResponse

@login_required
def add_product(request):
    if not request.user.is_staff:
        return redirect('home')
    
    if request.method == 'POST':
        name = request.POST.get('name')
        price = request.POST.get('price')
        image = request.POST.get('image')
        stock = request.POST.get('stock')
        
        Product.objects.create(
            name=name,
            price=price,
            image=image,
            Stock=stock
        )
        return redirect('home')
    
    return render(request, 'pages/add_product.html')

@login_required
def edit_product(request, id):
    
    if not request.user.is_staff:
        return redirect('home')
    
    product = Product.objects.get(id=id)
    
    if request.method == 'POST':
        product.name = request.POST.get('image')
           
    
    

def home(request): 
    query = request.GET.get('q')
    
    #if query:
       # products = Product.objects.filter(name_incontains=query)
    #else:
    products = Product.objects.all()     
    
    return render(request, 'pages/home.html', {"products": products})

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


