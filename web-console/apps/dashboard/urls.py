from django.urls import path, re_path, include
from . import views

urlpatterns = [
    path('', views.index, name='dashboard'),  # main
    path('support/', views.support_page, name='support'), # support page
    path('JSON/', views.send_json_to_client), # json
    path("createProject/", include("apps.create_project.urls")),
    path("editProject/", include("apps.edit_project.urls")),
    path("reminders/", include("apps.Reminders.urls")),
    # Matches any html file
    re_path(r'^.*\.*', views.page_not_found, name='page_not_found')
]
