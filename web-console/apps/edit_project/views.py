from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.http import HttpResponse, FileResponse
from importlib.machinery import SourceFileLoader
import os

from django.template import loader
from django.templatetags.static import static

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()

initial_survey_link = None
initial_description = None
initial_participants = None
remove_participants_list = None


@login_required(login_url="/login/")
def edit_project(request):
    # This data shows up on drop down for participants
    all_users_drop_down = firebase.get_all_users_names()

    if request.method == 'POST':
        global initial_survey_link, initial_description, initial_participants, remove_participants_list

        # Once we have a project id we want to call a fire base query to get
        # the project metadata
        project_id = request.POST.get('selected_project')
        remove_participants_list = request.POST.get('remove_participants')

        # On the edit page, when the user clicks on the add participant button,
        # the user's email is stored in the new_participant_email
        new_participant_email = request.POST.get('new_participant_email')
        # On the edit page, the selected project is stored in the proj_name variable, this will help us check if the
        # new participant is in the selected project to determine if it needs to be added
        proj_name = request.POST.get('proj_name')

        # The following if condition is here to delete a project
        selected_delete_project = request.COOKIES.get('selectedDeleteProject')

        if selected_delete_project is not None:
            # get project participants [list] to remove their data from users collection
            part_list = firebase.get_participant_list(selected_delete_project)
            firebase.remove_project_from_participants(selected_delete_project, part_list)

            # get uuids associated with the project.
            uuids = firebase.get_uuids(selected_delete_project)
            # delete reminder info of the project/projects from firebase
            if len(uuids) != 0:
                for uuid in uuids:
                    firebase.removeBackUp(uuid)

            # deleting the project
            firebase.delete_project_document(selected_delete_project)
            list_of_projects = firebase.get_all_project_names()

            try:
                return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects,
                                                                  'message_success': 'Project deleted successfully!',
                                                                  'all_users_drop_down': all_users_drop_down})
            except:
                html_template = loader.get_template('home/page-500.html')
                return HttpResponse(html_template.render({}, request))

        # When the user clicks on new participant the participant email is taken from the input field on frontend
        if new_participant_email is not None and proj_name is not None:

            # if the user does not exist in the users collection on firebase
            if not firebase.user_exist(new_participant_email):
                # Inform the client that the user does not exit through a cookie
                response = HttpResponse("Cookie Set")
                response.set_cookie('user_does_not_exist', new_participant_email)
                return response

            # if the new participant email is not a member of the selected project
            if not firebase.is_user_member_of_project(proj_name, new_participant_email):

                # add new participant to selected project on firebase
                firebase.add_participant_to_project(proj_name, new_participant_email)

                # add project to the users collection of that particular participant
                firebase.add_project_to_user(new_participant_email, proj_name)

                # Inform the client that the user has been added by adding a card to add participants
                response = HttpResponse("Cookie Set")
                response.set_cookie('user_does_exist', new_participant_email)
                return response
            else:
                response = HttpResponse("Cookie Set")
                response.set_cookie('user_is_member_of_project', new_participant_email)
                return response

        # Gets the value from the dropdown and returns information about the
        # selected project from firebase which is sent back
        # to the front end as a cookie which populates the appropriate input fields
        if project_id is not None:

            # Document data of all projects in a dict
            project_dict = firebase.get_project_document_data(project_id)

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
            if remove_participants_list is not None and remove_participants_list != "" and project_name is not None:
                firebase.remove_participants_from_project(project_name, email_processor(remove_participants_list))
                firebase.remove_project_from_participants(project_name, email_processor(remove_participants_list))

            # if surveylink and description fields are populated according to project selected
            if initial_survey_link is not None and initial_description is not None:

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
            # Passing the context info to populate the dropdown option
            try:
                return render(request, 'home/edit-project.html', {'list_of_projects_dict': list_of_projects,
                                                                  'message_success': 'Project updated successfully!',
                                                                  'all_users_drop_down': all_users_drop_down})
            except:
                html_template = loader.get_template('home/page-500.html')
                return HttpResponse(html_template.render({}, request))

    if request.method == 'GET':
        list_of_projects = firebase.get_all_project_names()
        try:
            return render(request, 'home/edit-project.html',
                          {'list_of_projects_dict': list_of_projects, 'all_users_drop_down': all_users_drop_down})
        except:
            html_template = loader.get_template('home/page-500.html')
            return HttpResponse(html_template.render({}, request))


# When we receive the list of participants, it is a string. Therefore we need to split it at ','
# to individually store each participant in an array
def email_processor(string):
    string_array = string.split(",")
    return string_array

# shows exclamation through javascript to user
@login_required(login_url="/login/")
def delete(request):
    img = open(os.getcwd() + '/apps/static/assets/images/exclamation-mark.png', 'rb')
    response = FileResponse(img)
    return response

@login_required(login_url="/login/")
def adctivity_user(request):
    img = open(os.getcwd() + '/apps/static/assets/images/user/user-3.png', 'rb')
    response = FileResponse(img)
    return response

