#!/usr/bin/env python
"""
Copyright (c) 2019 - present AppSeed.us
"""

import sys

import firebase_admin
from firebase_admin import credentials

from Schedule import *
import os


def main():
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(
            "Couldn't import Django. Are you sure it's installed and "
            "available on your PYTHONPATH environment variable? Did you "
            "forget to activate a virtual environment?"
        ) from exc

    ##################################################################################################################
    # Firebase
    ##################################################################################################################
    # provide file path for firebase credentials (Needs to be taken out during build [CI])
    #os.environ[

    #     "GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/rogue/Downloads/ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json"
   

         #"GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/alejandromacias/Documents/ema-firebase-credentials/ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json"


    # # initializing app using credentials
    # firebase_admin.initialize_app(credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")))
    ##################################################################################################################

    # Starts the background deamon thread the runs the sceduling system
    run_continuously()

    execute_from_command_line(sys.argv)

    schedule.every().second.do(background_job)


if __name__ == '__main__':
    main()
