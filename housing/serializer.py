from rest_framework import serializers
from .models import House

class HouseSerializer(serializers.ModelSerializer):
    """
    Serializer for the House model.
   
    This serializer handles the conversion of House model instances to and from JSON
    for API communication. It includes all fields from the House model except 'oid'
    which is read-only.
   
    Attributes:
        oid (int): Primary key, auto-generated unique identifier (read-only)
        rent (Decimal): Monthly rent amount with 2 decimal places
        beds (int): Number of bedrooms
        baths (int): Number of bathrooms  
        square_feet (int): Total square footage of the house
        address (str): Street address of the house
        description (str): Detailed description of the house
        More_infomation (str): URL for additional information
        contact (int): Contact phone number
   
    Example:
        >>> house = House.objects.get(oid=1)
        >>> serializer = HouseSerializer(house)
        >>> serializer.data
        {
            'oid': 1,
            'rent': '1500.00',
            'beds': 3,
            'baths': 2,
            'square_feet': 1200,
            'address': '123 Main St',
            'description': 'Beautiful 3-bedroom house',
            'More_infomation': 'https://example.com',
            'contact': 1234567890
        }
    """
   
    class Meta:
        model = House
        fields = '__all__'
        read_only_fields = ['oid']