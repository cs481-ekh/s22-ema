import threading
import time
import schedule


#method to start background thread running the scueding system takes in a int in secends to sleep between checking to see if there are jobs to run defualt 10
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
                #runs any pending jobs that came up between the last run and now
                schedule.run_pending()
                time.sleep(interval)

    #creates thread
    continuous_thread = ScheduleThread()
    #sets thread to deamon so it will die needs to be done before the start
    continuous_thread.daemon = True
    continuous_thread.start()


def background_job():
    print('Hello from the background thread')





