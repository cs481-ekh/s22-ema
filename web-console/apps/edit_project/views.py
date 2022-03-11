from django.shortcuts import render
from django.http import HttpResponse
from importlib.machinery import SourceFileLoader
import os

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()


def edit_project(request):
    if request.method == 'POST':
        # print(request.POST.get('selected_project'))

        # Once we have a project id we want to call a fire base query to get
        # the project metadata
        project_id = request.POST.get('selected_project')

        project_dict = firebase.get_project_document_data(project_id)

        print(project_dict)

        return render(request, 'home/edit-project.html')

    if request.method == 'GET':

        list_of_projects = firebase.get_all_project_names()

        print(list_of_projects)

        # This grabs the project selected from the front end
        project_selected = request.GET.get('selectedProject')
        # This grabs the survey link on the front end
        survey_link = request.GET.get('surveyLink')
        # This grabs the characters entered on the front end
        description = request.GET.get("description")

        print(project_selected)
        # If a project is select
        if project_selected != "Select":
            context = {'selectedProject': project_selected,
                       'surveyLink': survey_link,
                       'description': description
                       }
        else:  # the "Select" option is selected
            print("on Select option")
            # context = {'selectedProject': "Select",
            #            'surveyLink': "",
            #            'description': "",
            #            'participant_list': ""}
            # return render(request, 'home/edit-project.html', context, list_of_projects)

        return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects})

