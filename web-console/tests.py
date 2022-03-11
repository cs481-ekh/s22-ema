from _pytest.capture import capfd

from Schedule import *
from django.test import TestCase
from Schedule import *

Schedule = SourceFileLoader("Schedule", os.getcwd() + "/Schedule.py").load_module()


class TestCase(TestCase):

    def test_Schedule_oneJob(self):
        schedule.every(3).seconds.do(background_job).tag('test')

        # Start the background thread
        stop_run_continuously = run_continuously()

        getback = schedule.get_jobs('test')
        print(getback)

        # Stop the background thread
        # stop_run_continuously.set()
        schedule.clear('test')
        assert getback != '[]'

    # tests the method to add a reminder that fires once
    def test_Schedule_system_once(self):
        # Start the background thread
        stop_run_continuously = run_continuously()

        Schedule.add_reminder_once('2022-2-24', '08:30', 'Project1', 'unitTest2')

        getback = schedule.get_jobs('unitTest2')
        schedule.clear('unitTest2')

        assert len(getback) == 1

    # tests the method to add a reminder that runs daily
    def test_Schedule_system_daily(self):
        # Start the background thread
        stop_run_continuously = run_continuously()

        Schedule.add_reminder_daily('2022-2-24', '08:30', '2023-2-25', '00:00', 'Project1', 'unitTest2')

        getback = schedule.get_jobs('unitTest2')
        schedule.clear('unitTest2')

        assert len(getback) == 1

    # tests the method to add a reminder that weekly daily
    def test_Schedule_system_weekly(self):
        # Start the background thread
        stop_run_continuously = run_continuously()

        Schedule.add_reminder_weekly('2022-2-25', '08:30', '2023-2-25', '00:00', 'Project1', 'unitTest2')

        getback = schedule.get_jobs('unitTest2')
        schedule.clear('unitTest2')

        assert len(getback) == 1

    # Attempts to add multiple events to the reminder system
    def test_Schedule_system_multi(self):
        # Start the background thread
        stop_run_continuously = run_continuously()

        Schedule.add_reminder_once('2022-2-24', '08:30', 'Project1', 'unitTest3')
        Schedule.add_reminder_daily('2022-2-24', '08:30', '2023-2-25', '00:00', 'Project1', 'unitTest3')
        Schedule.add_reminder_weekly('2022-2-25', '08:30', '2023-2-25', '00:00', 'Project1', 'unitTest3')

        getback = schedule.get_jobs('unitTest3')
        schedule.clear('unitTest3')

        assert len(getback) == 3
