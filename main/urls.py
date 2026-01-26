from django.contrib import admin
from django.urls import path, include
from django.urls import re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from auth.views import LogoutView, PasswordRecoveryView


schema_view = get_schema_view(
   openapi.Info(
      title="Affordable Housing API",
      default_version='v1',
      description="API for managing affordable housing listings",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@housing.local"),
      license=openapi.License(name="MIT License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("housing.urls")),  # Include housing app URLs for regular views
    path("auth/", include("djoser.urls")),
    path("auth/", include("djoser.urls.jwt")),
    path("auth/logout/", LogoutView.as_view()),
    path("auth/recover/", PasswordRecoveryView.as_view()),
]
