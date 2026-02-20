from rest_framework import serializers
from .models import Order, Table

class TableSerializer(serializers.ModelSerializer):
    class Meta:
        model = Table
        fields = ["id", "name","is_available","created_at"] 

class OrderSerializer(serializers.ModelSerializer):
    table_nombre = serializers.CharField(source="table_id.name", read_only=True)

    class Meta:
        model = Order
        fields = ["id","items_summary","total","status","created_at","table_id","table_nombre"]