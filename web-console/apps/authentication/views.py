# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
import os
import re
import random
from importlib.machinery import SourceFileLoader
from django.contrib.auth.models import User
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import LoginForm
from django.contrib.auth import get_user_model

google_emailer = SourceFileLoader("google_emailer", os.getcwd() + "/google_emailer.py").load_module()

# email_found
email_found = False


def login_view(request):
    # checks if the user is authenticated than redirect to home.
    if request.user.is_authenticated:
        return redirect("/")

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


# logging user out
def logout_view(request):
    logout(request)
    return render(request, "home/login.html")


def reset_password(request):
    # checks if the user is not authenticated than redirect to login.
    if not request.user.is_authenticated:
        return redirect("/login")
    # Grabbing the value of our input fields
    username = request.POST.get('user_name')
    user_password = request.POST.get('user-password')
    user_confirm_password = request.POST.get('user-confirm-password')

    # Security check before changing the password
    if username is not None and user_password is not None and user_confirm_password is not None:

        # If the passwords are not at least 8 characters long or the passwords doesn't contain
        # at least one uppercase letter, one lowercase letter, one number and one special character
        if validate_password(user_password) is None or validate_password(user_confirm_password) is None:
            # Populating fields with what the user had initially entered before submitting and notifying
            # them with the error message
            return render(request, 'home/auth-reset-pass.html',
                          {'u_name': username, 'user_pw': user_password, 'user_confirm_pw': user_confirm_password,
                           'message_error': "turn message red"})

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
                # Grab the user if it exists
                user = user_model.objects.get(username=username)
                user.set_password(user_password)
                user.save()

                # Authenticating user aka login user
                user = authenticate(username=username, password=user_password)
                login(request, user)

                return render(request,
                              "home/login.html")  # Needs to be changed later to direct to dashboard/  once dashboard is implemented

    return render(request, "home/auth-reset-pass.html")


def recover_password(request):
    # checks if the user is  authenticated than redirect to dashboard.
    if request.user.is_authenticated:
        return redirect("/")
    else:
        if request.method == 'POST':
            # get recover email upon post
            recover_email = request.POST.get("recover_email")

            if recover_email is not None:
                # get super user emails
                superusers_emails = User.objects.filter(is_superuser=True).values_list('email').all()
                for email_tuples in superusers_emails:
                    for email in email_tuples:
                        if email == recover_email:
                            global email_found
                            email_found = True
                            break
                if email_found:
                    user_model = get_user_model()
                    user = user_model.objects.get(email=recover_email)
                    # generate password and set the password to that user password
                    new_password = generate_random_password()
                    user.set_password(new_password)
                    # Save the query
                    user.save()
                    # send user and password to the given email address.
                    email_pass_dict = read_google_email_cred_file()
                    message = "Dear " + str(user) + ",\n" + "Here is your user admin: " + str(
                        user) + "\nHere is your password: " + new_password
                    # send email
                    google_emailer.emailProcessor(email_pass_dict['email'], email_pass_dict['pass'], recover_email,
                                                  "EMA - [Admin - password]",
                                                  message)
                    # Inform user that email was sent using a Cookie


    return render(request, "home/recover_password.html")


def read_google_email_cred_file():
    f = open(os.environ['GOOGLE_EMAIL_CREDENTIALS'], "r")
    email = f.readline().split(" ")[1]
    password = f.readline().split(" ")[1]
    email_pass_dict = {'email': email, 'pass': password}
    return email_pass_dict


# generates random password
def generate_random_password():
    lower_case = "abcdefghijklmnopqrstuvwxyz"
    upper_case = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
    numbers = "0123456789"
    symbols = "@3$&*/\?"

    use_for = lower_case + upper_case + numbers + symbols
    length_for_password = 8
    password = "".join(random.sample(use_for, length_for_password))
    return password


# Function will check if the string is at least 8 characters with at least one uppercase letter, one lowercase letter,
# one number and one special character. NOTE - Password cannot be started with a '.' (period)
def validate_password(password_string):
    # if there is no match, x will equal None
    x = re.match(r"(?=^.{8,}$)(?=.*\d)(?=.*[!~@#\.()\$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$", password_string)

    return x
