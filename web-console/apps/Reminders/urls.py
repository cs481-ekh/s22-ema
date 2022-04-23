from django.urls import path, re_path
from apps.Reminders import views

urlpatterns = [
    # The home page
    path('', views.index, name='index'),
    path('activity_user/', views.adctivity_user, name="activity_user")
    # Matches any html file
    # re_path(r'^.*\.*', views.pages, name='pages')
    # path('test/', views.api_test)
]