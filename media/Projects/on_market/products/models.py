from django.db import models

# Create your models here.

class Product(models.Model):
    name = models.CharField(max_length=200)
    price = models.FloatField()
    description = models.TextField()
    Stock = models.IntegerField()
    image = models.ImageField(upload_to='products/')
    
    def _str_(self):
        return self.name
    
    
class Cart(models.Model):
    session_id = models.CharField(max_length=255)
    
    def _str_(self):
        return self.session_id
    
class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE)
    Product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quality = models.IntegerField(default=1)       
