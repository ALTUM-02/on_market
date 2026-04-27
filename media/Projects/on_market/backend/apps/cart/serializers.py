from rest_framework import serializers
from .models import CartItem

class CartSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItem
        fields = '_all_'