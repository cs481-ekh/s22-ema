from django.contrib.auth.decorators import login_required
from importlib.machinery import SourceFileLoader
from django.shortcuts import render
import os

firebase = SourceFileLoader("fbase", os.getcwd() + "/fbase.py").load_module()


@login_required(login_url="/login/")
def create_project(request):
    if request.method == 'POST':

        project_id = request.POST.get('projectId')  # This field on front end is required.
        survey_link = request.POST.get('surveyLink')  # This field on front end is required.

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

        if project_id is not None and survey_link is not None:
            # run firebase query to see if the project exist.
            if firebase.project_document_exist(project_id) is not True:
                # checks if there are any duplicate values in the participant list if there are
                # than they are automatically removed.
                participants = removed_duplicate(participants)
                # Write data to firebase
                # firebase.write_project(project_id, survey_link, description, participants)
                return render(request, 'home/create-project.html')

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
