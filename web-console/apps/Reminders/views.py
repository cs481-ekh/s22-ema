from importlib.machinery import SourceFileLoader
import os
from django.contrib.auth.decorators import login_required
from django.http import HttpResponse
from django.shortcuts import render


Schedule = SourceFileLoader("Schedule", os.getcwd() + "/Schedule.py").load_module()


#view for Notfication setting
@login_required(login_url="/login/")
def index(request):
    if request.method == 'POST':
        #seprating out incoming variable
        print(list(request.POST.items()))
        selectedProject = request.POST.get('selectedProject')
        startDate = request.POST.get('startDate')
        startTime = request.POST.get('startTime')
        selection = request.POST.get('selection')
        endDate = request.POST.get('endDate')
        endTime = request.POST.get('endTime')

        #Selection is once add one reminder to system
        if selection == 'Once':
            Schedule.add_reminder_once(startDate, startTime, selectedProject,'')

        #Checks to ensure there is a end date/time if the program does not run once
        if selection != 'Once':
            if endDate == '' or endTime == '':
                #todo return error code to frontend
                return render(request, 'home/notification-settings.html')

        #if the selection is weekly
        if selection == 'Weekly':
            Schedule.add_reminder_weekly(startDate, startTime, endDate, endTime, selectedProject,'')

        if selection == 'Daily':
            Schedule.add_reminder_daily(startDate, startTime, endDate, endTime, selectedProject, '')

    return render(request, 'home/notification-settings.html')
