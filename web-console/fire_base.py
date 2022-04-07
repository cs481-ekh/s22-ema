from firebase_admin import firestore, messaging
import datetime


# Connecting to firebase
def db_connect_firebase():
    # print("Connected to Firebase Database!")
    db = firestore.Client()
    return db


########################################################################################################################
#                                                   Project Queries                                                    #
########################################################################################################################

# Reading (projects name) from the collection
def get_all_project_names():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'projects').stream()
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id}')
    return document_list


# Reading (projects) data from the collection
def get_all_projects():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'projects').stream()
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id} => {doc.to_dict()}')
    return document_list


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
        "surveyLink": survey_link,
        "description": description,
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


# returns document data of the specific project from the 'projects' collection
def get_project_document_data(project_id):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'projects').document(project_id)
    doc = doc_ref.get()
    if doc.exists:
        data_dict = doc.to_dict()
        return data_dict
    else:
        return None


# Being able to edit any meta-data in the project other than participants
# provided a document name. pass participants as they are
def update_project_details(document_name, project_id, survey_link, description, participants):
    # Connecting to Firebase
    db = db_connect_firebase()

    # delete the previous document
    delete_project_document(document_name)

    # New values to be added
    data = {
        "projectId": project_id,
        "dateCreated": datetime.datetime.now(),
        "surveyLink": survey_link,
        "description": description,
        "participants": participants
    }

    # creating the document with the new name
    db.collection(u'cities').document(project_id).set(data)


# function to update project survey link
def update_project_survey_link(project_id, new_survey_link):
    # Connecting to Firebase
    db = db_connect_firebase()

    city_ref = db.collection(u'projects').document(project_id)
    # Deleting the old survey link
    city_ref.update({
        u'surveyLink': firestore.DELETE_FIELD
    })
    # Inserting the new survey link
    city_ref.set({
        u'surveyLink': new_survey_link
    }, merge=True)


# function to update project description
def update_project_description(project_id, new_description):
    # Connecting to Firebase
    db = db_connect_firebase()

    city_ref = db.collection(u'projects').document(project_id)
    # Deleting the old description
    city_ref.update({
        u'description': firestore.DELETE_FIELD
    })
    # Inserting the new description
    city_ref.set({
        u'description': new_description
    }, merge=True)


# adding participants to the project.
def add_participant_to_project(document_name, participant_email):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'projects').document(document_name)

    # Atomically adds given participant email to the 'participants' array field.
    doc_ref.update({u'participants': firestore.ArrayUnion([participant_email])})


# removing participants from project.
def remove_participants_from_project(document_name, participant_email):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'projects').document(document_name)
    # Atomically remove given participant email from the 'participants' array field.
    doc_ref.update({
        u'participants': firestore.ArrayRemove(participant_email)
    })


# deletes the project given a document name (project name)
def delete_project_document(document_name):
    # Connecting to Firebase
    db = db_connect_firebase()
    db.collection(u'projects').document(document_name).delete()


def is_user_member_of_project(project_name, participant_email):
    participant_list = get_participant_list(project_name)

    # Looping through the participants in project_name
    for part in participant_list:
        # checking if the new participant is already a member of the project_name
        if part == participant_email:
            return True
    # The participant is not a member of project_name
    return False


def get_participant_list(project_name):
    # Connecting to Firebase
    db = db_connect_firebase()

    # this contains a list of the participants who are a member of project_name
    list_of_participants_dict = db.collection(u'projects').document(project_name).get(
        field_paths={'participants'}).to_dict()

    return list_of_participants_dict['participants']


########################################################################################################################
#                                                   Users Queries                                                      #
########################################################################################################################

# Reading (users name) from the collection
def get_all_users_names():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'users').stream()
    document_list = []
    for doc in docs:
        document_list.append(f'{doc.id}')
    return document_list


# Reading (users) data from the collection
def get_all_users():
    # Connecting to Firebase
    db = db_connect_firebase()
    docs = db.collection(u'users').stream()
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


#  get user data
def get_user_data(user_email):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'users').document(user_email)
    doc = doc_ref.get()
    return doc.to_dict()


# Adds project to users dictionary in users collection
def add_project_to_user(user_email, project_name):
    db = db_connect_firebase()
    doc_ref = db.collection(u'users').document(user_email)

    # Adds project name to users collection
    doc_ref.update({u'projectId': firestore.ArrayUnion([project_name])})


# removing project from users collection of particular user
def remove_project_from_participant(project_name, participant_email):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'users').document(participant_email)

    # Atomically remove given participant email from the 'participants' array field.
    doc_ref.update({u'projectId': firestore.ArrayRemove([project_name])})


# removes the list of participants from the project.
def remove_project_from_participants(project_name, participants_email_list):
    # Looping through the list to remove participant from the remove_participants_list
    for part in participants_email_list:
        remove_project_from_participant(project_name, part)


########################################################################################################################
#                                                  Notification Queries                                                #
########################################################################################################################


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
def send_group_notification(registration_token_list, expire_time, survey_link, project_id):
    # Create a list containing up to 500 registration tokens.
    # These registration tokens come from the client FCM SDKs.

    # send expiration date/time, surveyLink to data, projectId to the mobile app.
    message = messaging.MulticastMessage(
        data={'expiration': str(expire_time), 'surveyLink': str(survey_link), 'projectID': str(project_id)},
        tokens=registration_token_list,
    )

    print(registration_token_list)
    try:
        response = messaging.send_multicast(message)
        # See the BatchResponse reference documentation
        # for the contents of response.
        print('{0} messages were sent successfully'.format(response.success_count))
    except:
        print('Error in getting response')


########################################################################################################################
#                                                  Notification Backup                                                #
########################################################################################################################
# removes a backup from the backup table selecting via uuid
def removeBackUp(uuid):
    db = db_connect_firebase()
    db.collection(u'reminderBackUp').document(uuid).delete()


# creates a new entry
def createNewBackUp(uuid, projectName, startDate, reminderTime, repeating, expirationDate, expirationTime):
    # Connecting to Firebase
    db = db_connect_firebase()

    # Collection reference
    col_ref = db.collection(u'reminderBackUp')

    # New values to be added
    new_values = {
        "uuid": uuid,
        "projectName": projectName,
        "startDate": startDate,
        "reminderTime": reminderTime,
        "repeating": repeating,
        "expirationDate": expirationDate,
        "expirationTime": expirationTime
    }

    # Adding new values to firebase
    col_ref.document(uuid).create(new_values)


# gets all back ups from the firebase will need to loop threw on the other end
def getAllBackUps():
    db = db_connect_firebase()
    docs = db.collection(u'reminderBackUp').stream()
    return docs


# check if uuid document (uuid) exists in "reminderBackUp" collection
def uuid_document_exist(document_name):
    # Connecting to Firebase
    db = db_connect_firebase()
    doc_ref = db.collection(u'reminderBackUp').document(document_name)
    doc = doc_ref.get()
    if doc.exists:
        # the uuid exists
        return True
    else:
        # the uuid is free
        return False
