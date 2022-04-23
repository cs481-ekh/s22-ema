from datetime import datetime
from importlib.machinery import SourceFileLoader
import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse, FileResponse
from django.shortcuts import render
from django.template import loader
from core.settings import EMA_ROOT
firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()
Schedule = SourceFileLoader("Schedule", os.getcwd() + "/Schedule.py").load_module()


# view for Notfication setting
@login_required(login_url=f"{EMA_ROOT}/login/")
def index(request):
    list_of_projects = firebase.get_all_project_names()
    project_id = request.POST.get('selected_project')
    removelist = request.POST.get('removed_participants_list')
    error = []
    flag = False
    if request.method == 'POST':
        # separating out incoming variable
        selectedProject = request.POST.get('selectedProject')
        startDate = request.POST.get('startDate')
        startTime = request.POST.get('startTime')
        selection = request.POST.get('selection')
        endDate = request.POST.get('endDate')
        endTime = request.POST.get('endTime')

        # *** During our last sprint, as we are cleaning up files, we can possibly remove this check since
        # our input check has been strengthened with javascript and html ***
        # Checks to ensure there is a end date/time if the program does not run once
        if selection != 'Once':
            if endDate == '' or endTime == '':
                # should add an error that returns if there is an issue based on how the selection box is done
                error.append('For Daily and Weekly Notifications please enter an expiration date and time!')
                flag = True

        if startDate == '' or startTime == '':
            error.append('Please enter a start date and a time for notification!')
            flag = True

        if selectedProject == 'Select Project':
            error.append('Please select a project to add a reminder to!')
            flag = True

        if flag:
            try:
                return render(request, 'home/notification-settings.html',
                          {'list_of_projects_dict': list_of_projects, 'error_code': error})
            except:
                html_template = loader.get_template('home/page-500.html')
                return HttpResponse(html_template.render({}, request))

        # removes reminder
        if removelist is not None:
            Schedule.removeReminder(removelist)

        # gets information about reminders assisted with a project for display
        if project_id is not None:
            # Document data of all projects in a dict
            project_dict = firebase.getAllBackUps()

            uuid = []
            reminderTime = []
            startDate = []
            startDateDate = []
            expirationTime = []
            expirationDate = []

            for reminder in project_dict:
                dict = reminder.to_dict()
                if project_id == dict['projectName']:
                    uuid.append(dict['uuid'])
                    dateOBJ = datetime.strptime(dict['reminderTime'], "%H:%M")
                    dateOut = dateOBJ.strftime("%I:%M %p")
                    reminderTime.append(dateOut)
                    startDate.append(Schedule.get_day_of_week(dict['startDate']))
                    startDateDate.append(dict['startDate'])

                    dateOBJ = datetime.strptime(dict['expirationTime'], "%H:%M")
                    dateOut = dateOBJ.strftime("%I:%M %p")

                    expirationTime.append(dateOut)
                    expirationDate.append(dict['expirationDate'])

            # Setting cookies so that javascript can grab them to populate
            # input text fields
            response = HttpResponse("Cookie Set")
            response.set_cookie('uuid', uuid)
            response.set_cookie('reminderTime', reminderTime)
            response.set_cookie('startDate', startDate)
            response.set_cookie('startDateDate', startDateDate)
            response.set_cookie('expirationDate', expirationDate)
            response.set_cookie('expirationTime', expirationTime)
            return response

        # A unique id is generated and will be tagged to the reminder, and it will be backed up to our backup
        # reminder collection
        unique_id = Schedule.generate_uuid()

        # Selection is once add one reminder to system
        if selection == 'Once':
            Schedule.add_reminder_once(startDate, startTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)
            try:
                return render(request, 'home/notification-settings.html',
                          {'list_of_projects_dict': list_of_projects, 'error_code': "The reminder has been scheduled successfully!"})
            except:
                html_template = loader.get_template('home/page-500.html')
                return HttpResponse(html_template.render({}, request))

        # if the selection is weekly
        if selection == 'Weekly':
            Schedule.add_reminder_weekly(startDate, startTime, endDate, endTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)
            error = "The reminder has been scheduled successfully!"

        # if the selection is Daily
        if selection == 'Daily':
            Schedule.add_reminder_daily(startDate, startTime, endDate, endTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)
            error = "The reminder has been scheduled successfully!"

    try:
        # returns the same view of the notfication page no matter what
        return render(request, 'home/notification-settings.html',
                      {'list_of_projects_dict': list_of_projects, 'error_code': error})
    except:
        html_template = loader.get_template('home/page-500.html')
        return HttpResponse(html_template.render({}, request))



@login_required(login_url=f"{EMA_ROOT}/login/")
def adctivity_user(request):
    img = open(os.getcwd() + '/apps/static/assets/images/user/user-3.png', 'rb')
    response = FileResponse(img)
    return response
