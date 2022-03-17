# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.urls import path
from .views import login_view, logout_view, reset_password

urlpatterns = [
    path("login/", login_view, name="ema_login"),
    path("ema_logout/", logout_view, name="ema_logout"),
    path("ema_resetPassword/", reset_password, name="ema_reset_password")
]
