from django.db import models

# Create your models here.
class House(models.Model):
    rent = models.DecimalField(max_digits=8, decimal_places=2, default=1000.00) 
    beds = models.IntegerField(default=3)
    baths = models.IntegerField(default=3)
    square_feet = models.IntegerField(default=1000)
    address = models.CharField(default="", max_length=255)
    description = models.TextField(default="")
    contact = models.IntegerField(default=1234567890)
