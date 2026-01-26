from rest_framework import serializers
from .models import House, SavedHouse
from django.contrib.auth.models import User

# Serializer for the House model.
class HouseSerializer(serializers.ModelSerializer):
    class Meta:
        model = House
        fields = '__all__'
        read_only_fields = ['oid']

# This serializer handles saved listings for users.
class SavedHouseSerializer(serializers.ModelSerializer):
    house = HouseSerializer(read_only=True)
    house_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = SavedHouse
        fields = ['id', 'house', 'house_id', 'saved_at']
        read_only_fields = ['id', 'saved_at']