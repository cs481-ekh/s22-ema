# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
from firebase_admin import firestore
import os
import datetime


@login_required(login_url="/login/")
def index(request):
    context = {'segment': 'index'}
    html_template = loader.get_template('home/index.html')
    # These tests were conducted
    read_projects()
    write_projects("test2", "https://www.facebook.com/", "This is test2", ['abc@gmail.com', 'efg@gmail.com'])
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
    db = firestore.Client()
    return db


# Reading (projects) data from the collection
def read_projects():
    # Connecting to Firebase
    db = connect_firebase()
    docs = db.collection(u'projects').stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')


# Writing (project) data to firebase
def write_projects(project_name, survery_link, notes, participants):

    # Connecting to Firebase
    db = connect_firebase()

    # Collection reference
    col_ref = db.collection(u'projects')

    # New values to be added
    new_values = {
        "dateCreated": datetime.datetime.now(),
        "desc": notes,
        "projectId": project_name,
        "surveryLink": survery_link,
        "participants": participants
    }

    # Adding new values to firebase
    col_ref.document(project_name).create(new_values)

