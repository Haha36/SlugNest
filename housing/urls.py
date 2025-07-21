# Django URL Configuration - This file defines the website's URL structure
# Each path() below maps a URL to a specific view function
# Think of this as the "routing table" that tells Django what to do for each URL
from django.urls import path, include
from rest_framework.routers import DefaultRouter

from django.contrib.auth import views as auth_views
from . import views

router = DefaultRouter()


urlpatterns = [
    path('api/', include(router.urls)),
    # House management URLs
    # create/ - Shows form to add new house listing
    path('create/', views.create_view, name='create_url'),
    
    # show/ - Displays all house listings
    path('show/', views.read_view, name='show_url'),
    
    # update/<int:f_oid> - Updates specific house by ID
    # <int:f_oid> is a URL parameter that captures the house ID from the URL
    # Example: update/123 would pass 123 as f_oid to the update_view function
    path('update/<int:f_oid>', views.update_view, name= 'update_url'),
    
    # delete/<int:f_oid> - Deletes specific house by ID
    path('delete/<int:f_oid>', views.delete_view, name= 'delete_url'),
    
    # savedRead - Shows user's saved houses
    path('savedRead', views.savedRead_view, name='savedRead_url'),
    
    # Password reset URLs - Django's built-in password reset functionality
    # password_reset/ - Form to enter email for password reset
    path(
        'password_reset/',
        views.custom_password_reset,
        name='password_reset'
    ),
    
    # password_reset/done/ - Confirmation page after email is sent
    path(
        'password_reset/done/',
        auth_views.PasswordResetDoneView.as_view(
            template_name='registration/password_reset_done.html'
        ),
        name='password_reset_done'
    ),
    
    # reset/<uidb64>/<token>/ - Link in email that user clicks to reset password
    # uidb64 and token are security parameters to verify the reset request
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='registration/password_reset_confirm.html'
        ),
        name='password_reset_confirm'
    ),
    
    # reset/done/ - Success page after password is reset
    path(
        'reset/done/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='registration/password_reset_complete.html'
        ),
        name='password_reset_complete'
    ),
    
    # Authentication URLs - Django's built-in login/logout functionality
    # login/ - User login form
    path('login/', auth_views.LoginView.as_view(), name='login'),
    
    # logout/ - Logs user out and redirects
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    # index/ - Homepage
    path("index/", views.index, name="index"),
    
    # accounts/register/ - New user registration form
    path('accounts/register/', views.registration_view, name='register'),
]