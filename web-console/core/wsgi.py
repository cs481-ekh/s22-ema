# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from importlib.machinery import SourceFileLoader
import os
import firebase_admin
import firebase_admin.auth
from firebase_admin import credentials
from django.core.wsgi import get_wsgi_application
Schedule = SourceFileLoader("Schedule", os.getcwd() + "Schedule.py").load_module()

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json"
os.environ["GOOGLE_EMAIL_CREDENTIALS"] = "google_email_creds.txt"
firebase_admin.initialize_app(credentials.Certificate(os.environ.get("GOOGLE_APPLICATION_CREDENTIALS")))
Schedule.run_continuously()
Schedule.firebase_DueDate_Perge()
Schedule.dabatBaseReload()

application = get_wsgi_application()
