from json import dumps

from django.contrib.auth.decorators import login_required
from importlib.machinery import SourceFileLoader
from django.http import HttpResponse
from django.shortcuts import render
import os

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()

# keeping track of non-participants.
non_participants = []


@login_required(login_url="/login/")
def create_project(request):
    if request.method == 'POST':

        project_id = request.POST.get('projectId')  # This field on front end is required.
        survey_link = request.POST.get('surveyLink')  # This field on front end is required.

        # Participant email comes in after clicking Add Participant on the front end.
        participant_email = request.POST.get('participantEmail')
        if participant_email is not None:
            if not firebase.user_exist(participant_email):
                non_participants.append(participant_email)
                # setting cookie for non-participant
                response = HttpResponse("Cookie Set")
                response.set_cookie('non_participant_email', participant_email)
                return response
            else:
                response = HttpResponse("Cookie Set")
                response.set_cookie('participant_email', participant_email)
                return response

        # Getting other values from the template (create-project)
        description = request.POST.get("description")

        # This data comes from clicking create project button on front end.
        # Note - It does not get posted upon calling Add Participant button on the front end.
        participants = request.POST.get("participant_list")

        # The code in the if condition only runs when Create New Project (button) is clicked on the front end
        # If participant type is not None than
        if participants is not None:
            # Split method is used because data is coming as a string
            participants = participants.split(",")
            # checks if there are any duplicate values in the participant list if there are
            # than they are automatically removed.
            participants = removed_duplicate(participants)

        if project_id is not None and survey_link is not None:
            # run firebase query to see if the project exist.
            if firebase.project_document_exist(project_id) is not True:

                if len(participants) == 1:
                    if participants[0] == '':
                        firebase.write_project(project_id, survey_link, description, [])
                    else:
                        # Write data to firebase
                        firebase.write_project(project_id, survey_link, description, participants)
                        # add projectId to each participant dictionary in users collection on firebase
                        for part in participants:
                            firebase.add_project_to_user(part, project_id)
                else:
                    # Write data to firebase
                    firebase.write_project(project_id, survey_link, description, participants)
                    # add projectId to each participant dictionary in users collection on firebase
                    for part in participants:
                        firebase.add_project_to_user(part, project_id)

                # clearing the global non-participants list [to carry out new instance of project.]
                non_participants.clear()

                return render(request, 'home/create-project.html', {'message_success': 'Project created Successfully!'})
            else:
                return render(request, 'home/create-project.html',
                              {'message_error': 'Project name exists! Please choose a different name'})

    # html_template = loader.get_template('home/create-project.html')
    return render(request, 'home/create-project.html')


# Custom method to remove duplicates from the list.
def removed_duplicate(my_list):
    temp_list = []
    for i in my_list:
        if i not in temp_list:
            temp_list.append(i)

    my_list = temp_list
    return my_list
