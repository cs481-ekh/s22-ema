from firebase_admin import firestore
import os
import datetime


# Connecting to firebase
def connect_firebase():
    # provide file path for firebase credentials
    os.environ[
        "GOOGLE_APPLICATION_CREDENTIALS"] = "/Users/dnlrao/Desktop/ema-ramen-firebase-adminsdk-7lvc1-97d920871f.json"
    print("Connected to Firebase!")
    db = firestore.Client()
    return db


# Reading (projects) data from the collection
def read_projects():
    # Connecting to Firebase
    db = connect_firebase()
    docs = db.collection(u'projects').stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')


# Writing (project) data to firebase
def write_project(project_name, survey_link, notes, participants):
    # Connecting to Firebase
    db = connect_firebase()

    # Collection reference
    col_ref = db.collection(u'projects')

    # New values to be added
    new_values = {
        "dateCreated": datetime.datetime.now(),
        "desc": notes,
        "projectId": project_name,
        "surveryLink": survey_link,
        "participants": participants
    }

    # Adding new values to firebase
    col_ref.document(project_name).create(new_values)


# Reading (users) data from the collection
def read_users():
    # Connecting to Firebase
    db = connect_firebase()
    docs = db.collection(u'users').stream()
    for doc in docs:
        print(f'{doc.id} => {doc.to_dict()}')
