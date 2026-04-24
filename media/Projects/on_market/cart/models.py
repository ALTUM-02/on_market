from django.db import models
from django.contrib.auth.models import User
from products.models import Product

# Create your models here.
class Cart(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    
    def __str__(self):
        return self.user.username
 #   session_id = models.CharField(max_length=255)

#class CartItem(models.Model):
  #  cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
   # product = models.ForeignKey(
    #    Product,
     #   on_delete=models.CASCADE,
      #  related_name="cart_items"  
    #)
    #quantity = models.IntegerField(default=1)
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    product =  models.ForeignKey(Product, on_delete=models.CASCADE) 
    quantity = models.PositiveIntegerField(default=1)
    
    def total_price(self):
        return self.product.price * self.quantity