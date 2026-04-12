from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.permissions import IsAdminUser
from .models import Product, Cart, CartItem
from .serializers import ProductSerializer
# views.py
from django.http import JsonResponse

def home(request): 
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


def add_to_cart(request, id):
    try:
        product = Product.objects.get(id=id)
    except Product.DoesNotExist:
        return JsonResponse({"error": "Product not found"}, status=404)

    session_id = request.session.session_key
    if not session_id:
        request.session.create()

    cart, created = Cart.objects.get_or_create(session_id=session_id)

    item, created = CartItem.objects.get_or_create(cart=cart, product=product)

    if not created:
        item.quantity += 1
        item.save()

    return JsonResponse({"message": "Added to cart"})