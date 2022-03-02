from django.urls import path, re_path
from apps.create_project import views

urlpatterns = [
    path('', views.create_project, name='createProject'),
    path('sendEmail/', views.sendEmail, name='sendEmail')
]