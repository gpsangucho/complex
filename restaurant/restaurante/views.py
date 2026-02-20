from django.shortcuts import render

# Create your views here.


from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import SearchFilter, OrderingFilter
from .models import Table, Order
from .serializers import TableSerializer, OrderSerializer
from .permissions import IsAdminOrReadOnly

class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all().order_by("id")
    serializer_class = TableSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    search_fields = ["name"]
    ordering_fields = ["id", "name"]

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.select_related("table_id").all().order_by("-id")
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [DjangoFilterBackend, SearchFilter, OrderingFilter]
    filterset_fields = ["table_id"]
    search_fields = ["modelo", "placa", "color", "table__nombre"]
    ordering_fields = ["id","total","status","items_summary", "creado_en"]


    def get_permissions(self):
        # Público: SOLO listar 
        if self.action == "list":
            return [AllowAny()]
        return super().get_permissions()