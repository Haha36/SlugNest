from django import forms
from .models import House


# creating a form
class HouseForm(forms.ModelForm):

    class Meta:

        model = House
        fields = '__all__'

        lables = {
            'rent': 'Monthly Rent', 
            'beds': 'Number Of Bedrooms', 
            'baths': 'Number of Bathrooms', 
            'square_feet': 'Sq. Ft', 
            'address': 'Address',
            'description': 'Description', 
            'contact': 'Contact Number',
        }

        widgets  = {
            'rent' : forms.NumberInput(attrs={'placeholder': 'eg. 1800'}),
            'beds' : forms.NumberInput(attrs={'placeholder': 'eg. 1800'}),
            'baths' : forms.NumberInput(attrs={'placeholder': 'eg. 1800'}),
            'square_feet' : forms.NumberInput(attrs={'placeholder': 'eg. 1800'}),
            'address' : forms.TextInput(attrs={'placeholder': 'eg. 1800'}),
            'description' : forms.Textarea(attrs={'placeholder': 'eg. 1800'}),
            'contact' : forms.NumberInput(attrs={'placeholder': 'eg. 1800'}),
            'moreInfo' : forms.URLInput(attrs={'placeholder': 'eg. https://example.com'}),
        }