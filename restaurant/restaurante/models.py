from django.db import models

# Create your models here.


#═-----------------------------------

from django.db import models

class Table(models.Model):
    name = models.CharField(max_length=120, unique=True)
    #name = models.CharField(max_length=50, unique=True)
    capacity = models.IntegerField()
    is_available = models.BooleanField(default= True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return self.name

class Order(models.Model):
    
    class Estado(models.TextChoices):
        PENDING = "pendiente", "Pendiente"
        IN_PROGRESS = "en_proceso", "En proceso"
        SERVED = "servido", "Servido"
        PAID = "pagado", "Pagado"
        
    
    items_summary = models.TextField(blank=True, default="")
    total = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    status = models.CharField(max_length=20, choices=Estado.choices,
                              default=Estado.PENDING)
    created_at = models.DateTimeField(auto_now_add=True)
    table_id = models.ForeignKey(Table, on_delete=models.PROTECT,related_name="mesas")
    

    def __str__(self):
        return f"{self.marca.nombre} {self.modelo} ({self.placa})"
    
    





