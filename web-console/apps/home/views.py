# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
import firebase_admin
from firebase_admin import firestore
import os


@login_required(login_url="/login/")
def index(request):
    context = {'segment': 'index'}
    html_template = loader.get_template('home/index.html')
    read_projects()
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


# Connecting to firebase
def connect_firebase():
    # provide file path for firebase credentials
    os.environ[
        "GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/dnlrao/Desktop/ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json"
    print("Connected to Firebase!")


# Reading (projects) data from the collection
def read_projects():
    # Connecting to Firebase
    connect_firebase()
    db = firestore.Client()
    docs = db.collection(u'projects').stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')
