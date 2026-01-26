from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.contrib.auth import views as auth_views
from . import views

# Router for ViewSet-based API endpoints
router = DefaultRouter()
router.register(r'listings', views.ListingsViewSet, basename='listings')  

urlpatterns = [
    # API routes using ViewSets
    path('api/', include(router.urls)),
    
    # Saved listings API endpoints
    path('api/saved/', views.SavedListingsView.as_view(), name='saved-listings'),
    path('api/saved/<int:house_id>/', views.SavedListingsView.as_view(), name='unsave-listing'),
    
    # Shows user's saved houses
    path('savedRead', views.savedRead_view, name='savedRead_url'),
    
    # Not relate to JWT
    path(
        'password_reset/',
        views.custom_password_reset,
        name='password_reset'
    ),
    
    # Confirmation page after email is sent for password reset
    path(
        'password_reset/done/',
        auth_views.PasswordResetDoneView.as_view(
            template_name='registration/password_reset_done.html'
        ),
        name='password_reset_done'
    ),
    
    # Link in email that user clicks to reset password
    path(
        'reset/<uidb64>/<token>/',
        auth_views.PasswordResetConfirmView.as_view(
            template_name='registration/password_reset_confirm.html'
        ),
        name='password_reset_confirm'
    ),
    
    # Success page after password is reset
    path(
        'reset/done/',
        auth_views.PasswordResetCompleteView.as_view(
            template_name='registration/password_reset_complete.html'
        ),
        name='password_reset_complete'
    ),
    
    # Authentication URLs 
    # login/ - User login form
    path('login/', auth_views.LoginView.as_view(), name='login'),
    
    # logout/ - Logs user out and redirects
    path('logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    # index/ - Homepage
    path("index/", views.index, name="index"),
]