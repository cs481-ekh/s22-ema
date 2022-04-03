from importlib.machinery import SourceFileLoader
import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()
Schedule = SourceFileLoader("Schedule", os.getcwd() + "/Schedule.py").load_module()


# view for Notfication setting
@login_required(login_url="/login/")
def index(request):
    list_of_projects = firebase.get_all_project_names()
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
        print(selectedProject)

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
            print(error)
            return render(request, 'home/notification-settings.html',
                          {'list_of_projects_dict': list_of_projects, 'error_code': error})

        # A unique id is generated and will be tagged to the reminder, and it will be backed up to our backup
        # reminder collection
        unique_id = Schedule.generate_uuid()

        # Selection is once add one reminder to system
        if selection == 'Once':
            Schedule.add_reminder_once(startDate, startTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)
            return render(request, 'home/notification-settings.html',
                          {'list_of_projects_dict': list_of_projects, 'error_code': error})

        # if the selection is weekly
        if selection == 'Weekly':
            Schedule.add_reminder_weekly(startDate, startTime, endDate, endTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)

        # if the selection is Daily
        if selection == 'Daily':
            Schedule.add_reminder_daily(startDate, startTime, endDate, endTime, selectedProject, unique_id)
            # adding our notification to our backUp reminder table
            firebase.createNewBackUp(unique_id, selectedProject, startDate, startTime, selection, endDate, endTime)

    # returns the same view of the notfication page no matter what
    return render(request, 'home/notification-settings.html',
                  {'list_of_projects_dict': list_of_projects, 'error_code': error})
