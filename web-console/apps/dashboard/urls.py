from django.urls import path, re_path
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),  # main
    path('support/', views.support_page, name='support'), # support page
    path('JSON/', views.send_json_to_client), # json
    # Matches any html file
    re_path(r'^.*\.*', views.page_not_found, name='pages')
]
