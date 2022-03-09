from firebase_admin import firestore, messaging
import datetime


# Connecting to firebase
def db_connect_firebase():
    print("Connected to Firebase Database!")
    db = firestore.Client()
    return db


# Reading (projects) data from the collection
def read_projects():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'projects').stream()
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id} => {doc.to_dict()}')
    return document_list


# Check if the user exist in the users collection
def user_exist(document_name):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'users').document(document_name)
    doc = doc_ref.get()
    if doc.exists:
        return True
    else:
        return False


# Writing (project) data to firebase
def write_project(project_id, survey_link, description, participants):
    # Connecting to Firebase
    db = db_connect_firebase()

    # Collection reference
    col_ref = db.collection(u'projects')

    # New values to be added
    new_values = {
        "projectId": project_id,
        "dateCreated": datetime.datetime.now(),
        "description": description,
        "surveyLink": survey_link,
        "participants": participants
    }

    # Adding new values to firebase
    col_ref.document(project_id).create(new_values)


# check if project document exist
def project_document_exist(document_name):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'projects').document(document_name)
    doc = doc_ref.get()
    if doc.exists:
        return True
    else:
        return False


# Reading (users) data from the collection
def read_users():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'users').stream()
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id} => {doc.to_dict()}')
    return document_list


# get user token using email address.
def get_user_registration_token(user_email):
    db = db_connect_firebase()
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

    # send expiration date/time, surveyLink to data, projectId to the mobile app.
    message = messaging.MulticastMessage(
        data={'score': '850', 'time': '2:45'},
        tokens=registration_token_list,
    )
    response = messaging.send_multicast(message)
    # See the BatchResponse reference documentation
    # for the contents of response.
    print('{0} messages were sent successfully'.format(response.success_count))
