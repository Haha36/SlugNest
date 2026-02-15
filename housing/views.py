from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import House, SavedHouse
from .forms import HouseForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView
from .serializer import HouseSerializer, SavedHouseSerializer
from django.contrib.auth.forms import AuthenticationForm,  UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.views import PasswordResetView
from django import forms
from django.shortcuts import render, redirect
from django.core.exceptions import ObjectDoesNotExist

#  ViewSet for managing house listings via REST API.
class ListingsViewSet(viewsets.ModelViewSet):
    queryset = House.objects.all().order_by('-oid')
    serializer_class = HouseSerializer
    permission_classes = [AllowAny]

    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)

    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

# API endpoint for managing saved listings.
class SavedListingsView(APIView):
    permission_classes = [IsAuthenticated]
    
    def get(self, request):
        saved_houses = SavedHouse.objects.filter(user=request.user)
        serializer = SavedHouseSerializer(saved_houses, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request):
        house_id = request.data.get('house_id')
        if not house_id:
            return Response(
                {'error': 'house_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            house = House.objects.get(oid=house_id)
        except House.DoesNotExist:
            return Response(
                {'error': 'House not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Check if already saved
        saved_house, created = SavedHouse.objects.get_or_create(
            user=request.user,
            house=house
        )
        
        if created:
            serializer = SavedHouseSerializer(saved_house)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(
                {'message': 'Listing already saved'}, 
                status=status.HTTP_200_OK
            )
    
    def delete(self, request, house_id=None):
        """Unsave a listing for the current user"""
        if not house_id:
            house_id = request.data.get('house_id')
        
        if not house_id:
            return Response(
                {'error': 'house_id is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        
        try:
            saved_house = SavedHouse.objects.get(
                user=request.user,
                house__oid=house_id
            )
            saved_house.delete()
            return Response(
                {'message': 'Listing unsaved successfully'}, 
                status=status.HTTP_200_OK
            )
        except SavedHouse.DoesNotExist:
            return Response(
                {'error': 'Saved listing not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

# Shows saved houses for the current user
def savedRead_view(request):
    obj = House.objects.all()
    form = HouseForm()
    template_name = 'saved_view.html'
    context = {'obj': obj}
    return render(request, template_name, context)

#Not relate to JWT
def login_view(request):
    """
    Handles user login (currently commented out - using Django's built-in login)
    - Authenticates username/password
    - Creates user session if credentials are valid
    """
    template_name = 'registration/login.html'
    form = AuthenticationForm()


    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')


            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f"Welcome, {username}!")
                return redirect(settings.LOGIN_REDIRECT_URL)
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Please correct the errors below.")


    context = {'form': form}
    return render(request, template_name, context)

# Homepage view
def index(request):
    return render(request, "index.html")


def custom_password_reset(request):
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            # Send password reset email
            form.save()
            return redirect('password_reset_done')
    return render(request, 'registration/password_reset.html')
#----------------- old authentication views---------------
# class RegistrationForm(UserCreationForm):
#     """
#     Custom registration form that extends Django's built-in user creation
#     - Adds email field to the standard username/password fields
#     """
#     email = forms.EmailField(required=True)
#     class Meta:
#         model=User
#         fields=("username", "email", "password1", "password2")


# def registration_view(request):
#     """
#     Handles new user registration
#     - GET: Shows registration form
#     - POST: Creates new user account and logs them in
#     """
#     if request.method=="POST":
#         form = RegistrationForm(request.POST)
#         if form.is_valid():
#             # Create new user account
#             user = form.save()
#             # Automatically log them in
#             login(request, user)
#             return redirect('show_url')
#     else:
#         form = RegistrationForm()
#     return render(request, "registration/register.html", {'form':form})


#-------------------Old Views----------------------------------------
# def create_view(request):
# """
# Handles creating new house listings
# - GET request: Shows the form to create a new house
# - POST request: Saves the new house data to database
# """
# # Check if user is submitting form data (POST) or just viewing the form (GET)
# if request.method == 'POST':
#     # Create form with submitted data
#     form = HouseForm(request.POST)
#     # Validate the form data
#     if form.is_valid():
#         # Save the new house to database
#         form.save()
#         # Redirect to the house listing page
#         return redirect('show_url')
# else:
#     # Create empty form for user to fill out
#     form = HouseForm()
# # Render the create form template with the form object
# return render(request, 'create_view.html', {'form': form})


# # TODO: wait for Front end to be done
# def read_view(request):
#     """
#     Displays all house listings
#     - Gets all houses from database and shows them in a list
#     """
#     # Query database for all house objects
#     obj = House.objects.all()
#     form = HouseForm()
#     template_name = 'read_view.html'
#     # Pass data to template (like props in React)
#     context = {'obj': obj}
#     return render(request, template_name, context)


# def update_view(request, f_oid):
#     """
#     Handles updating existing house listings
#     - f_oid: The unique ID of the house to update (comes from URL)
#     - GET: Shows form pre-filled with current house data
#     - POST: Saves updated data to database
#     """
#     # Get the specific house from database using its ID
#     obj = House.objects.get(oid = f_oid)
#     # Create form with current house data
#     form = HouseForm(instance=obj)
#     if request.method == 'POST':
#         # Update form with new submitted data
#         form = HouseForm(request.POST, instance=obj)
#         if form.is_valid():
#             # Save changes to database
#             form.save()
#             return redirect('show_url') ###
#     template_name = 'create_view.html'
#     context = {'form': form}
#     return render(request, template_name, context)


# def delete_view(request, f_oid):
#     """
#     Handles deleting house listings
#     - f_oid: The unique ID of the house to delete
#     - GET: Shows confirmation page
#     - POST: Actually deletes the house from database
#     """
#     # Get the specific house to delete
#     obj = House.objects.get(oid=f_oid)
#     if request.method == 'POST':
#         # Delete the house from database
#         obj.delete()
#         return redirect('show_url') ###
#     template_name = 'delete_view.html'
#     context = {'obj':obj}
#     return render(request, template_name, context)
# 





