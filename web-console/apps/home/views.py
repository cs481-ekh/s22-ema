# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
from importlib.machinery import SourceFileLoader
import os
firebase = SourceFileLoader("fbase", os.getcwd() + "/fbase.py").load_module()


@login_required(login_url="/login/")
def index(request):
    context = {'segment': 'index'}
    html_template = loader.get_template('home/index.html')
    # These tests were conducted
    # print(firebase.read_projects())
    # firebase.write_projects("test2", "https://www.facebook.com/", "This is test2", ['abc@gmail.com', 'efg@gmail.com'])
    # print(firebase.read_users())
    # print(firebase.get_user_registration_token("test1@gmail.com"))

    # tokens = []
    # tokenOne = firebase.get_user_registration_token("test1@gmail.com")
    # tokenTwo = firebase.get_user_registration_token("xojevop760@sueshaw.com")
    # print(tokenOne)
    # print(tokenTwo)
    # tokens.append(tokenOne)
    # tokens.append(tokenTwo)
    # firebase.send_group_notification(tokens)

    # print(firebase.read_projects()[2])
    return HttpResponse(html_template.render(context, request))


@login_required(login_url="/login/")
def pages(request):
    context = {}
    # All resource paths end in .html.
    # Pick out the html file name from the url. And load that template.
    try:

        load_template = request.path.split('/')[-1]

        if load_template == 'admin':
            return HttpResponseRedirect(reverse('admin:index'))
        context['segment'] = load_template

        html_template = loader.get_template('home/' + load_template)
        return HttpResponse(html_template.render(context, request))

    except template.TemplateDoesNotExist:

        html_template = loader.get_template('home/page-404.html')
        return HttpResponse(html_template.render(context, request))

    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render(context, request))

# Custom methods added.
@login_required(login_url="/login/")
def create_project(request):
    return HttpResponse("Hello, World!")