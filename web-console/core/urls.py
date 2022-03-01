# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
from django.db.migrations import serializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response



from django.contrib import admin
from django.urls import path, include
from rest_framework.urls import urlpatterns


urlpatterns = [
    path('admin/', admin.site.urls),          # Django admin route
    path("", include("apps.authentication.urls")), # Auth routes - login / register
    path("", include("apps.home.urls")),            # UI Kits Html files
    path('api/', include("apps.API.urls")),
]
