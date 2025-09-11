from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from . import views

<<<<<<< HEAD

=======
>>>>>>> d646e77ef825c2a2d5c17293fbd1afb786e14f12
urlpatterns = [
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
