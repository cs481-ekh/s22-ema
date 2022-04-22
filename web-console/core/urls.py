# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
from django.db.migrations import serializer
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework.urls import urlpatterns

from core.settings import EMA_REL
from apps.dashboard.views import index, page_not_found

site_patterns = [
    path('admin/', admin.site.urls),  # Django admin route
    path("", include("apps.authentication.urls")),  # Auth routes - login / register / forgot password
    path("", include("apps.dashboard.urls")),  # Dashboard routes - main / support
]

urlpatterns = [
   path(f'', include(site_patterns)),
   path(f'{EMA_REL}', index, name='dashboard'),
   path(f'{EMA_REL}/', include(site_patterns)),
   # Matches any html file
   re_path(r'^.*\.*', page_not_found, name='page_not_found')
]

