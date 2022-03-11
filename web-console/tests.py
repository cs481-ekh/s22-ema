from _pytest.capture import capfd

from Schedule import *
from django.test import TestCase

class TestCase(TestCase):

    def test_Schedule_oneJob(self):
        schedule.every(3).seconds.do(background_job).tag('test')

        #Start the background thread
        stop_run_continuously = run_continuously()

        getback = schedule.get_jobs('test')
        print(getback)

        # Stop the background thread
        #stop_run_continuously.set()

        assert getback != '[]'

    def test_sceduling_system_adds(self):


        #Start the background thread
        stop_run_continuously = run_continuously()

