from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Cart, CartItem
from products.models import Product
from .serializers import CartSerializer
import json
from django.http import JsonResponse


@login_required
def add_to_cart(request):
    data = json.loads(request.body)
    product_id = data.get("product_id")

    product = Product.objects.get(id=product_id)

    cart, created = Cart.objects.get_or_create(user=request.user)

    item, created = CartItem.objects.get_or_create(
        cart=cart,
        product=product
    )

    if not created:
        item.quantity += 1
        item.save()

    return JsonResponse({"status": "success"})


@login_required
def get_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)

    items = []
    for item in cart.cartitem_set.all():
        items.append({
            "id": item.id,
            "name": item.product.name,
            "price": item.product.price,
            "quantity": item.quantity,
            "total": item.total_price(),
        })

    return JsonResponse({"items": items})


@login_required
def remove_from_cart(request, item_id):
    item = CartItem.objects.get(id=item_id, cart__user=request.user)
    item.delete()
    return JsonResponse({"status": "deleted"})
def home(request):
    return JsonResponse({"message": "Welcome to On Market API"})

#Create your views here.
class CartViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartSerializer
    Permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return CartItem.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
        
               
    
