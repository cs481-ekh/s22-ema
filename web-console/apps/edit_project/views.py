from django.shortcuts import render
from django.http import HttpResponse
from importlib.machinery import SourceFileLoader
import os

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()

initial_survey_link = None
initial_description = None
initial_participants = None
remove_participants_list = None


def edit_project(request):
    if request.method == 'POST':
        global initial_survey_link, initial_description, initial_participants, remove_participants_list

        # Once we have a project id we want to call a fire base query to get
        # the project metadata
        project_id = request.POST.get('selected_project')
        remove_participants_list = request.POST.get('remove_participants')

        if project_id is not None:

            # Document data of all projects in a dict
            project_dict = firebase.get_project_document_data(project_id)
            # print(project_dict)

            # Survey link of selected project
            initial_survey_link = project_dict['surveyLink']

            # Description of selected project
            initial_description = project_dict['description']

            # List of participants of selected project
            initial_participants = project_dict['participants']

            # Setting cookies so that javascript can grab them to populate
            # input text fields
            response = HttpResponse("Cookie Set")
            response.set_cookie('surveyLink', initial_survey_link)
            response.set_cookie('description', initial_description)
            response.set_cookie('participants', initial_participants)
            return response
        else:
            # Getting the project name on POST
            project_name = request.POST.get('selectedProject')

            # This means that the participants list for the selected project needs to be updated on firebase
            if remove_participants_list is not None and project_name is not None:

                firebase.remove_participants_from_project(project_name, email_processor(remove_participants_list))
                print("Updated participants");

            # if surveylink and description fields are populated according to project selected
            if initial_survey_link is not None and initial_description is not None:

                # if a project has been selected
                if project_name is not None:
                    updated_survey_link = request.POST.get('surveyLink')
                    updated_description = request.POST.get('description')

                    # if survey link has been updated
                    if initial_survey_link != updated_survey_link:
                        pass
                        # Update description on firebase
                        firebase.update_project_survey_link(project_name, updated_survey_link)
                        print("Updated survey link");

                    # if description has been updated
                    if initial_description != updated_description:
                        pass
                        # update description on firebase
                        firebase.update_project_description(project_name, updated_description)
                        print("Updated description");
            print(firebase.get_project_document_data(project_name))
            # Returning successful message and list of projects for dropdown to edit projects
            list_of_projects = firebase.get_all_project_names()
            return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects,
                                                              'message_success': 'Project updated successfully!'})

    if request.method == 'GET':
        list_of_projects = firebase.get_all_project_names()
        return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects})


# When we receive the list of participants, it is a string. Therefore we need to split it at ','
# to individually store each participant in an array
def email_processor(string):
    string_array = string.split(",")
    return string_array
