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
     
