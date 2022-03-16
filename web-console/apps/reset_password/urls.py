from django.urls import path
from . import views

urlpatterns = [
    path('', views.reset_password, name='reset_password')
]