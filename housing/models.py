from django.db import models
from django.contrib.auth.models import User


class House(models.Model):
    """
    House model - represents a house listing in the database
    This is like a database table with columns for each field below
    """
    oid = models.AutoField(primary_key=True)
    
    rent = models.DecimalField(max_digits=8, decimal_places=2, default=1000.00) 
    
    beds = models.IntegerField(default=0)
    baths = models.IntegerField(default=0)

    square_feet = models.IntegerField(default=0, null=True)
    
    address = models.CharField(default="", max_length=255)
    
    description = models.TextField(default="")
    
    # URL field for additional information link (optional)
    More_information = models.URLField(max_length=200, blank=True, null=True)
    
    contact = models.CharField(default="Number, Email, or Social Media etc.")

# tracks which houses users have saved
class SavedHouse(models.Model):
    # on_delete=CASCADE means if user is deleted, their saved houses are also deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_houses')
    
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures a user can't save the same house twice
        unique_together = ('user', 'house')

    def __str__(self):
        return f"{self.user.username} saved {self.house.address}"