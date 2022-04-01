import threading
import time
from importlib.machinery import SourceFileLoader
import os
import schedule
import datetime
from datetime import date
from datetime import datetime
from datetime import timedelta
import uuid

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
# all jobs should be tagged with a uuid
def add_reminder_once(date, time, selectedProject, tag):
    schedule.every().day.at(time).do(run_single_reminder_job, start_date=date, project=selectedProject, tag=tag).tag(
        tag)


# creates a job to be run on a day of the week every week at a selected time
# all jobs should be tagged with a uuid
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
# all jobs should be tagged with a uuid
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

        print('x')


# standard job for daily and weekly jobs, will be written in another task
def run_standard_reminder_job(project):
    print('x')


def sendNotification(project):
    loaded_project = firebase.get_project_document_data(project)
    participants = loaded_project.get('participants')
    survey_link = loaded_project.get('surveyLink')

    user_token_list = []
    # 'erJdN5-qQK6gInbVyC_20k:APA91bG6m5GCrJ_dLoXGlHhXvc4fni2J85NUDWMwuNCkw3ypXrrKMcAwaBUi9zdtHG0urTSpLKcr2Gs4eS12P_zeEIrP3xFONyXN_Sy3tDxbvmwJx66fVpyLiJ_UY4ViS2zBAXB4ZCpA']
    for user in participants:
        user_token_list.append(firebase.get_user_registration_token(user))

    now = datetime.now()
    temp = now.strftime("%Y-%m-%d %H:%M:%S")
    expire_time = datetime.strptime(temp, "%Y-%m-%d %H:%M:%S") + timedelta(minutes=5)

    firebase.send_group_notification(user_token_list, expire_time, survey_link, project)


# function to remove a job with a uuid from the scheduling system and
def removeReminder(removeTag):
    # remove from Scheduling system
    schedule.clear(removeTag)
    # remove from firebase
    firebase.removeBackUp(removeTag)


# Function to generate a unique uuid that is not already taken by an existing reminder.
def generate_uuid():
    # flag to determine if uuid generated is taken or free
    id_status = None

    # while the uuid generated is not free (when id_status = true) in reminderBackUp collection, keep generating
    # a new uuid until it generates one that is free (when id_status = false)
    while id_status != False:
        # convert the uuid to a string uuid type
        id_string = str(uuid.uuid4())

        # if id_status returns true then the uuid is taken. If the id_status
        # is false, then the uuid is free
        id_status = firebase.uuid_document_exist(id_string)

    return id_string
