from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),  # main
    path('support/', views.support_page, name='support')  # support page
    # Matches any html file
    # re_path(r'^.*\.*', views.pages, name='pages')
]
