# Django Models - These define the database structure (like database tables)
# Each class below becomes a table in the database with the specified fields
from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class House(models.Model):
    """
    House model - represents a house listing in the database
    This is like a database table with columns for each field below
    """
    # Primary key - unique identifier for each house (auto-incrementing)
    oid = models.AutoField(primary_key=True)
    
    # Decimal field for rent amount (8 digits total, 2 decimal places)
    # Example: 1500.00, 2500.50
    rent = models.DecimalField(max_digits=8, decimal_places=2, default=1000.00) 
    
    # Integer fields for number of bedrooms and bathrooms
    beds = models.IntegerField(default=3)
    baths = models.IntegerField(default=3)
    
    # Square footage - can be null (empty) if not provided
    square_feet = models.IntegerField(default=1000, null=True)
    
    # Text field for house address (max 255 characters)
    address = models.CharField(default="", max_length=255)
    
    # Long text field for detailed description
    description = models.TextField(default="")
    
    # URL field for additional information link (optional)
    More_infomation = models.URLField(max_length=200, blank=True, null=True)
    
    # Contact number field
    contact = models.IntegerField(default=1234567890)

class SavedHouse(models.Model):
    """
    SavedHouse model - tracks which houses users have saved
    This creates a many-to-many relationship between users and houses
    """
    # Foreign key to User model - links each saved house to a specific user
    # on_delete=CASCADE means if user is deleted, their saved houses are also deleted
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_houses')
    
    # Foreign key to House model - links to the specific house being saved
    house = models.ForeignKey(House, on_delete=models.CASCADE)
    
    # Timestamp of when the house was saved (automatically set when created)
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Ensures a user can't save the same house twice
        unique_together = ('user', 'house')

    def __str__(self):
        # String representation for admin interface and debugging
        return f"{self.user.username} saved {self.house.address}"