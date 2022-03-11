import threading
import time
from importlib.machinery import SourceFileLoader
import os
import schedule
import datetime
from datetime import date
from datetime import datetime

firebase = SourceFileLoader("firebase", os.getcwd() + "/fire_base.py").load_module()


# method to start background thread running the scueding system takes in a int in secends to sleep between checking to see if there are jobs to run defualt 10
def run_continuously(interval=10):
    """Continuously run, while executing pending jobs at each
    elapsed time interval.
    @return cease_continuous_run: threading. Event which can
    be set to cease continuous run. Please note that it is
    *intended behavior that run_continuously() does not run
    missed jobs*. For example, if you've registered a job that
    should run every minute and you set a continuous run
    interval of one hour then your job won't be run 60 times
    at each interval but only once.
    """
    cease_continuous_run = threading.Event()

    class ScheduleThread(threading.Thread):
        @classmethod
        def run(cls):
            while not cease_continuous_run.is_set():
                # runs any pending jobs that came up between the last run and now
                schedule.run_pending()
                time.sleep(interval)

    # creates thread
    continuous_thread = ScheduleThread()
    # sets thread to deamon so it will die needs to be done before the start
    continuous_thread.daemon = True
    continuous_thread.start()


def background_job():
    print('Hello from the background thread')


# Gets the day of the week of the input date
def get_day_of_week(date):
    dayofweek = datetime.strptime(date, '%Y-%m-%d').strftime('%A')
    return dayofweek


# creates a job that will only run once at a selected time and date
def add_reminder_once(date, time, selectedProject, tag):
    schedule.every().day.at(time).do(run_single_reminder_job, start_date=date, project=selectedProject, tag=tag).tag(
        tag)


# creates a job to be run on a day of the week every week at a selected time
def add_reminder_weekly(startDate, startTime, endDate, endTime, selectedProject, tag):
    # get the day of the week and siwtch statment to set based on the day of the week
    dayofWeek = get_day_of_week(startDate)

    if dayofWeek == 'Monday':
        schedule.every().monday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                project=selectedProject).tag(tag)
    elif dayofWeek == 'Tuesday':
        schedule.every().tuesday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                 project=selectedProject).tag(tag)
    elif dayofWeek == 'Wednesday':
        schedule.every().wednesday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                   project=selectedProject).tag(tag)
    elif dayofWeek == 'Thursday':
        schedule.every().thursday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                  project=selectedProject).tag(tag)
    elif dayofWeek == 'Friday':
        schedule.every().friday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                project=selectedProject).tag(tag)
    elif dayofWeek == 'Saturday':
        schedule.every().saturday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                  project=selectedProject).tag(tag)
    elif dayofWeek == 'Sunday':
        schedule.every().sunday.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                                project=selectedProject).tag(tag)
    else:
        print('error')


# creates a job to run every day of the week at a selected time
def add_reminder_daily(startDate, startTime, endDate, endTime, selectedProject, tag):
    schedule.every().day.at(startTime).until(endDate + ' ' + endTime).do(run_standard_reminder_job,
                                                                         project=selectedProject).tag(tag)


# The single run job this job checks if its the day and if so hits the firebase API then removes itself
def run_single_reminder_job(start_date, project, tag):
    current_time = date.today()
    current_time = current_time.strftime("%Y-%m-%d")
    parsed_start_date = datetime.strptime(start_date, "%Y-%m-%d").date()
    if str(current_time) == str(parsed_start_date):
        # return schedule.cancel_job()
        # run the job to hit the API
        loaded_project = firebase.get_project_document_data(project)
        print(loaded_project)


# standard job for daily and weekly jobs, will be written in another task
def run_standard_reminder_job(project):
    print('x')
