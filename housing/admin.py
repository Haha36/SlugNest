from django.contrib import admin
from .models import House

@admin.register(House)
class HousingAdmin(admin.ModelAdmin):
    fields = ['rent', 'beds', 'baths', 'square_feet', 'address', 'description', 'contact']