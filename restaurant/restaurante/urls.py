from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import TableViewSet, OrderViewSet

router = DefaultRouter()
router.register(r"mesas", TableViewSet, basename="mesas")
router.register(r"ordenes", OrderViewSet, basename="ordenes")

urlpatterns = []
urlpatterns += router.urls