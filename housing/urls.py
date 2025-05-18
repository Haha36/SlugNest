from django.urls import path

from . import views

urlpatterns = [
    path('create/', views.create_view, name='create_url'),
    path('read/', views.read_view, name='show_url'),
    path('update/<int:f_oid>', views.update_view, name= 'update_url'),
    path('delete/<int:f_oid>', views.delete_view, name= 'delete_url'),
    path('savedRead', views.savedRead_view, name='savedRead_url'),
]