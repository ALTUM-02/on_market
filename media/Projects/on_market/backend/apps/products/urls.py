from django.urls import path, include 
from rest_framework.routers import DefaultRouter
from .views import ProductViewSet
from .views import home
from . import views

router = DefaultRouter()    
router.register('', ProductViewSet)

urlpatterns = router.urls

urlpatterns = [
    path('', views.home, name='home'),
    path('product/<int:id>/', views.product_detail, name='product_detail'),
    path('add-product/', views.add_product, name='add_product'),
    path('edit-product/<int:id>/', views.edit_product, name='edit_product'),
    path('delete-product/<int:id>/', views.delete_product, name='delete_product'),
]
