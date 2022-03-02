from django import template
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.urls import reverse
from importlib.machinery import SourceFileLoader
from django.shortcuts import render
import os

firebase = SourceFileLoader("fbase", os.getcwd() + "/fbase.py").load_module()


# Custom methods added.
@login_required(login_url="/login/")
def create_project(request):
    if request.method == 'POST':
        # Getting values from the template (create-project)
        projectId = request.POST.get('projectId')
        surveyLink = request.POST.get('surveyLink')
        description = request.POST.get("description")
        participants = request.POST.get("participant_list")
        print(request.POST)
        # Check if the required fields are not None
        if projectId and surveyLink is not None:
            # Check if the project does not exist than send the data to Firebase
            if firebase.project_doc_exist(projectId) is not True:
                # adding data to firebase
                print(projectId, surveyLink, description, participants)
                return render(request, 'home/create-project.html')
                # firebase.write_project(projectId, surveyLink, description, participants)

    # html_template = loader.get_template('home/create-project.html')
    return render(request, 'home/create-project.html')