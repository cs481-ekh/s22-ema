from importlib.machinery import SourceFileLoader

import pytz
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseRedirect, HttpResponse
from django.shortcuts import render, redirect
from django.template import loader
from django.urls import reverse
from django.utils.translation import template
from django.http import JsonResponse
from datetime import datetime
import pendulum
import os

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()
project_participants = []


@login_required(login_url="/login/")
def index(request):
    try:
        # POST only comes in if drop down is value is changed
        if request.method == 'POST':

            # Getting project name from POST
            proj_name = request.POST.get("selectedProject")

            # helps clear project_participants list dictionary defined as global variable.
            is_clear_list = request.POST.get("clear_list")
            if is_clear_list is not None:
                if is_clear_list is not None:
                    project_participants.clear()

            # Safe check for project name
            if proj_name is not None and proj_name != 'Select':

                # Getting participant list from firebase present in the project
                part_list = firebase.get_participant_list(proj_name)

                # build a list of dictionary to send a JSON response
                for part in part_list:
                    firebase_user_data = firebase.get_user_data(part)
                    # this will populate the list with users dictionaries, to be sent to client end.
                    project_participants.append(firebase_user_data)

                # JSON response is sent from here
                if len(project_participants) != 0:
                    # This will send the JSON data to the client
                    send_json_to_client(request)
                    # After JSON data is sent than empty the list of dictionaries.

                part_list_count = len(part_list)

                # percentage to be displayed on the card
                participant_percentage = round((part_list_count / len(firebase.get_all_users_names())) * 100, 2)

                # Setting cookie on client end for the data to be represented:
                response = HttpResponse("Cookie Set")

                # set part_list_count on client end for the data to be represented
                response.set_cookie('part_list_count', part_list_count)

                # setting percentage cookie to be displayed on card
                response.set_cookie('participant_percentage', participant_percentage)

                # JSON_set cookie
                response.set_cookie('set_json', 'set_json')

                return response

        # Contains list of projects
        list_of_projects = firebase.get_all_project_names()

        # total projects present on firebase
        list_of_projects_count = len(list_of_projects)

        # total users present on firebase
        list_of_users_count = len(firebase.get_all_users_names())

        notification_data_list = []
        # send Notification data to the template
        for reminder_collection in firebase.getAllBackUps():
            notification_data_list.append(reminder_collection.to_dict())

        # setting time zone.
        tz = pytz.timezone('America/Boise')
        now = datetime.now(tz=tz)
        # current date and time to be sent to template
        current_date = now.strftime("%Y-%m-%d")
        current_time = now.strftime("%H:%M")

        # get start of week and get end of week. This data goes in the
        today = pendulum.now()
        start_of_week = today.start_of('week').to_date_string()
        end_of_week = today.end_of('week').to_date_string()

        context = {
            'list_of_projects_dict': list_of_projects,
            'list_of_projects_count': list_of_projects_count,
            'list_of_users_count': list_of_users_count,
            'notification_data_list': notification_data_list,
            'curr_date': current_date,
            'curr_time': current_time,
            'start_of_week': start_of_week,
            'end_of_week': end_of_week
        }

        return render(request, 'home/index.html', context)

    # This loads if the index.html fails to render.
    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render({}, request))


@login_required(login_url="/login/")
def send_json_to_client(request):
    global project_participants
    # Safety check if the list does not contain any dictionary
    if len(project_participants) == 0:
        return redirect('/')
    else:
        return JsonResponse(project_participants, safe=False)


# Rendering the support page
@login_required(login_url="/login/")
def support_page(request):
    return render(request, 'home/support.html')


# To be removed later
@login_required(login_url="/login/")
def pages(request):
    context = {}
    html_template = loader.get_template('home/page-404.html')
    return HttpResponse(html_template.render(context, request))
