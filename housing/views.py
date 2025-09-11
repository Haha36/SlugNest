from django.shortcuts import render, redirect
from django.http import HttpResponse
from .models import House
from .forms import HouseForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .serializer import HouseSerializer
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from django.contrib.auth.forms import AuthenticationForm,  UserCreationForm
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.contrib import messages
from django.conf import settings
from django.contrib.auth.views import PasswordResetView
from django import forms
from django.shortcuts import render, redirect


class ListingsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing house listings via REST API.
   
    This ViewSet provides full CRUD operations for house listings:
    - GET /api/listings/ - List all houses
    - POST /api/listings/ - Create a new house
    - GET /api/listings/{id}/ - Retrieve a specific house
    - PUT /api/listings/{id}/ - Update a house (all fields)
    - PATCH /api/listings/{id}/ - Update a house (partial)
    - DELETE /api/listings/{id}/ - Delete a house
   
    All endpoints return JSON responses and accept JSON data.
    The 'oid' field is read-only and auto-generated.
    """
    queryset = House.objects.all()
    serializer_class = HouseSerializer
    permission_classes = [AllowAny]


    @swagger_auto_schema(
        operation_description="Get all house listings",
        responses={
            200: openapi.Response(
                description="List of all houses",
                schema=HouseSerializer(many=True)
            )
        }
    )
    def list(self, request, *args, **kwargs):
        return super().list(request, *args, **kwargs)


    @swagger_auto_schema(
        operation_description="Create a new house listing",
        request_body=HouseSerializer,
        responses={
            201: openapi.Response(
                description="House created successfully",
                schema=HouseSerializer
            ),
            400: "Bad Request - Invalid data"
        }
    )
    def create(self, request, *args, **kwargs):
        return super().create(request, *args, **kwargs)


    @swagger_auto_schema(
        operation_description="Get a specific house listing by id",
        responses={
            200: openapi.Response(
                description="House details",
                schema=HouseSerializer
            ),
            404: "House not found"
        }
    )
    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Update a house listing (all fields)",
        request_body=HouseSerializer,
        responses={
            200: openapi.Response(
                description="House updated successfully",
                schema=HouseSerializer
            ),
            400: "Bad Request - Invalid data",
            404: "House not found"
        }
    )
    def update(self, request, *args, **kwargs):
        return super().update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Partially update a house listing",
        request_body=HouseSerializer,
        responses={
            200: openapi.Response(
                description="House updated successfully",
                schema=HouseSerializer
            ),
            400: "Bad Request - Invalid data",
            404: "House not found"
        }
    )
    def partial_update(self, request, *args, **kwargs):
        return super().partial_update(request, *args, **kwargs)

    @swagger_auto_schema(
        operation_description="Delete a house listing",
        responses={
            204: "House deleted successfully",
            404: "House not found"
        }
    )
    def destroy(self, request, *args, **kwargs):
        return super().destroy(request, *args, **kwargs)

def savedRead_view(request):
    """
    Shows saved houses for the current user
    - Similar to read_view but filters for user's saved houses
    """
    obj = House.objects.all()
    form = HouseForm()
    template_name = 'saved_view.html'
    context = {'obj': obj}
    return render(request, template_name, context)

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
            # Extract username and password from form
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')


            # Check if username/password combination is valid
            user = authenticate(request, username=username, password=password)
            if user is not None:
                # Log the user in (creates session)
                login(request, user)
                messages.success(request, f"Welcome, {username}!")
                return redirect(settings.LOGIN_REDIRECT_URL)
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Please correct the errors below.")


    context = {'form': form}
    return render(request, template_name, context)


def index(request):
    """
    Homepage view - just renders the main index template
    """
    return render(request, "index.html")


def custom_password_reset(request):
    """
    Handles password reset requests
    - User enters email address
    - System sends reset link if email exists
    """
    if request.method == 'POST':
        form = PasswordResetForm(request.POST)
        if form.is_valid():
            # Send password reset email
            form.save()
            return redirect('password_reset_done')
    #else:
        #form = PasswordResetForm()
   
    return render(request, 'registration/password_reset.html')


class RegistrationForm(UserCreationForm):
    """
    Custom registration form that extends Django's built-in user creation
    - Adds email field to the standard username/password fields
    """
    email = forms.EmailField(required=True)
    class Meta:
        model=User
        fields=("username", "email", "password1", "password2")


def registration_view(request):
    """
    Handles new user registration
    - GET: Shows registration form
    - POST: Creates new user account and logs them in
    """
    if request.method=="POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            # Create new user account
            user = form.save()
            # Automatically log them in
            login(request, user)
            return redirect('show_url')
    else:
        form = RegistrationForm()
    return render(request, "registration/register.html", {'form':form})


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





