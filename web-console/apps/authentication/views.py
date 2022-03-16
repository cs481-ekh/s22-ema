# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

# Create your views here.
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login
from .forms import LoginForm, SignUpForm
from django.contrib.auth import get_user_model


def login_view(request):
    form = LoginForm(request.POST or None)

    msg = None

    if request.method == "POST":

        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                return redirect("/")
            else:
                msg = 'Invalid credentials'
        else:
            msg = 'Error validating the form'

    return render(request, "accounts/login.html", {"form": form, "msg": msg})


def register_user(request):
    msg = None
    success = False

    if request.method == "POST":
        form = SignUpForm(request.POST)
        if form.is_valid():
            form.save()
            username = form.cleaned_data.get("username")
            raw_password = form.cleaned_data.get("password1")
            user = authenticate(username=username, password=raw_password)

            msg = 'User created - please <a href="/login">login</a>.'
            success = True
            login(request, user)

            # return redirect("/login/")
            return redirect("/")

        else:
            msg = 'Form is not valid'
    else:
        form = SignUpForm()

    return render(request, "accounts/register.html", {"form": form, "msg": msg, "success": success})


def reset_password(request):
    # Grabbing the value of our input fields
    username = request.POST.get('user_name')
    user_password = request.POST.get('user-password')
    user_confirm_password = request.POST.get('user-confirm-password')

    # Security check before changing the password
    if username is not None and user_password is not None and user_confirm_password is not None:

        # If the both password input fields match, then proceed with the password change
        if user_password == user_confirm_password:
            user_model = get_user_model()

            # This will help us determine if the admin user exists in database
            count = user_model.objects.filter(username=username).count()

            # If count is 0, then the admin user does not exist
            if count == 0:
                return render(request, "home/user-not-exist.html")
            # Admin user exists, proceed with updating password
            else:
                user = user_model.objects.get(username=username)
                user.set_password(user_password)
                user.save()

                # Authenticating user aka login user
                user = authenticate(username=username, password=user_password)
                login(request, user)

                return render(request,
                              "home/login.html")  # Needs to be changed later to direct to dashboard/  once dashboard is implemented

    return render(request, "home/auth-reset-pass.html")
