from django.shortcuts import render
from django.http import HttpResponse
from importlib.machinery import SourceFileLoader
import os

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()

initial_survey_link = None
initial_description = None


def edit_project(request):
    if request.method == 'POST':

        # Once we have a project id we want to call a fire base query to get
        # the project metadata
        project_id = request.POST.get('selected_project')

        global initial_survey_link, initial_description
        if project_id is not None:

            # Document data of all projects in a dict
            project_dict = firebase.get_project_document_data(project_id)

            # Survey link of selected project
            initial_survey_link = project_dict['surveyLink']

            # Description of selected project
            initial_description = project_dict['description']

            # Setting cookies so that javascript can grab them to populate
            # input text fields
            response = HttpResponse("Cookie Set")
            response.set_cookie('surveyLink', initial_survey_link)
            response.set_cookie('description', initial_description)
            return response
        else:
            # if surveylink and description fields are populated according to project selected
            if initial_survey_link is not None and initial_description is not None:

                # Getting the project name on POST
                project_name = request.POST.get('selectedProject')

                # if a project has been selected
                if project_name is not None:
                    updated_survey_link = request.POST.get('surveyLink')
                    updated_description = request.POST.get('description')

                    # if survey link has been updated
                    if initial_survey_link != updated_survey_link:
                        # Update description on firebase
                        firebase.update_project_survey_link(project_name, updated_survey_link)

                    # if description has been updated
                    if initial_description != updated_description:
                        # update description on firebase
                        firebase.update_project_description(project_name, updated_description)

            # Returning successful message and list of projects for dropdown to edit projects
            list_of_projects = firebase.get_all_project_names()
            return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects,
                                                              'message_success': 'Project updated successfully!'})

    if request.method == 'GET':
        list_of_projects = firebase.get_all_project_names()
        return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects})
