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
    error = ''
    if request.method == 'POST':
        # separating out incoming variable
        selectedProject = request.POST.get('selectedProject')
        startDate = request.POST.get('startDate')
        startTime = request.POST.get('startTime')
        selection = request.POST.get('selection')
        endDate = request.POST.get('endDate')
        endTime = request.POST.get('endTime')

        # Selection is once add one reminder to system
        if selection == 'Once':
            if startDate =='' or startTime == '':
                error = 'Please enter a start date and a time for notification'
                return render(request, 'home/notification-settings.html',
                              {'list_of_projects_dict': list_of_projects, 'error_code': error})
            Schedule.add_reminder_once(startDate, startTime, selectedProject, '')
            return render(request, 'home/notification-settings.html',
                          {'list_of_projects_dict': list_of_projects, 'error_code': error})

        # Checks to ensure there is a end date/time if the program does not run once
        if selection != 'Once':
            if endDate == '' or endTime == '':
                # should add an error that returns if there is an issue based on how the selection box is done
                error = 'For Daily and Weekly Notifications please enter an expiration date and time'
                print(error)
                return render(request, 'home/notification-settings.html',
                              {'list_of_projects_dict': list_of_projects, 'error_code': error})

        # if the selection is weekly
        if selection == 'Weekly':
            Schedule.add_reminder_weekly(startDate, startTime, endDate, endTime, selectedProject, '')

        # if the selection is Daily
        if selection == 'Daily':
            Schedule.add_reminder_daily(startDate, startTime, endDate, endTime, selectedProject, '')

    # returns the same view of the notfication page no matter what
    return render(request, 'home/notification-settings.html',
                  {'list_of_projects_dict': list_of_projects, 'error_code': error})
