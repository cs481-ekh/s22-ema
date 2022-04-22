from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.edit_project, name='editProject'),
    path('delete/', views.delete, name="warning"),
    path('activity_user/', views.adctivity_user, name="activity_user")
]