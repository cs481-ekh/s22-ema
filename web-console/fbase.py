from firebase_admin import firestore, messaging
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
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id} => {doc.to_dict()}')
    return document_list


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
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id} => {doc.to_dict()}')
    return document_list

# get user token using email address.
def get_user_registration_token(user_email):
    db = connect_firebase()
    doc_ref = db.collection(u'users').document(user_email)
    # getting document reference
    doc = doc_ref.get()
    # if document exists than convert the document to dictionary and return the token else raise an exception
    if doc.exists:
        reg_token_dict = doc.to_dict()
        registration_token = reg_token_dict['token']
        return registration_token
    else:
        raise Exception("No such document!")


# Send Notification to users given a list of notification registration tokens
# Warning only send in a list.
def send_group_notification(registration_token_list):
    # Create a list containing up to 500 registration tokens.
    # These registration tokens come from the client FCM SDKs.

    message = messaging.MulticastMessage(
        data={'score': '850', 'time': '2:45'},
        tokens=registration_token_list,
    )
    response = messaging.send_multicast(message)
    # See the BatchResponse reference documentation
    # for the contents of response.
    print('{0} messages were sent successfully'.format(response.success_count))