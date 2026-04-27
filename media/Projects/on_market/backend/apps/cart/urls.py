from django.urls import path
from . import views

urlpatterns = [
    path('api/cart/add/', views.add_to_cart),
    path('api/cart/', views.get_cart),
    path('cart/', views.cart_page, name='cart'),
    path('admin-cart/', views.admin_cart, name='admin_cart'),
    path('api/cart/remove/<int:item_id>/', views.remove_from_cart),
]
