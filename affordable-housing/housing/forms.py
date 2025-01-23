from django import forms
from .models import House


# creating a form
class HouseForm(forms.ModelForm):

    class Meta:

        model = House

        fields = [
            'rent', 
            'beds', 
            'baths', 
            'square_feet', 
            'address', 
            'description', 
            'contact',
            ]