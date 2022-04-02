import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:ema/actions/project_actions.dart';
import 'package:ema/utils/data_classes.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

FirebaseAuth auth = FirebaseAuth.instance;

// TODO: delete/manage this (was just for testing)
// Future<void> onActionSelected(String value) async {
//   switch (value) {
//     case 'subscribe':
//       {
//         print('Subscribing to test topic: notif_test');
//         await FirebaseMessaging.instance.subscribeToTopic('notif_test');
//         print('Subscription successful');
//       }
//       break;
//     case 'unsubscribe':
//       {
//         print('Unsubscibing from test topic: notif_test');
//         await FirebaseMessaging.instance.unsubscribeFromTopic('notif_test');
//         print('Unsubscription successful');
//       }
//       break;
//     default:
//       break;
//   }
// }

///
/// Project/subscription
///
Future<bool> subscribeToProjectTopic(List<dynamic> projectId) async {
  bool check = true;
  for (var element in projectId) {
    FirebaseMessaging.instance
        .subscribeToTopic(element)
        .then((value) => true)
        .catchError((check) => false);
  }
  return check;
}

///
/// Users
///
Future<String> addNewUser(
    usernameController, passwordController, projectIdController) async {
  String errorMessage = "";

  // subscribe to provided project id list
  // error checking doesn't matter here lmaaaoooo
  if (!(await checkProjectIdExists(projectIdController.text))) {
    errorMessage = "Project ID does not exist.";
    return errorMessage;
  }

  // register user with authentication
  String regUser =
      await registerUser(usernameController.text, passwordController.text);
  if (regUser != "") {
    errorMessage = "Could not register new user: $regUser";
    return errorMessage;
  }

  // add user to database to save projectId and other data
  // but only if auth worked
  // TODO: do we need to handle if auth succeeded but db add failed -- delete account and try again?

  List<String> projectList = <String>[];
  projectList.add(projectIdController.text);

  String addDb = await addUserToDatabase(usernameController.text, projectList);
  if (addDb != "") {
    errorMessage = "Could not add user to database: $addDb";
    return errorMessage;
  }

  //add new user to 'participants' list in Project
  bool addParticipant =
      await addUserToParticipants(usernameController.text, projectList);
  if (addParticipant == false) {
    errorMessage =
        "Could not add user to participants list in one or more projects";
    return errorMessage;
  }

  // if no errors yet, instantiate user object
  var firebaseUser = FirebaseAuth.instance.currentUser;
  InternalUser.instance(user: firebaseUser, projectId: projectList);
  await InternalUser.setStoredInstance(
      usernameController.text, passwordController.text);

  return errorMessage;
}

Future<String> addUserToDatabase(
    String username, List<String> projectId) async {
  CollectionReference users = FirebaseFirestore.instance.collection('users');
  return users
      .doc(username)
      .set({
        'email': username,
        'projectId': projectId,
        'dateCreated': DateTime.now(),
        'token': await FirebaseMessaging.instance.getToken(),
        'streak': 0,
        'streakDate': DateTime.now()
      })
      .then((value) => "")
      .catchError((error) => error.toString());
}

Future<String> registerUser(String username, String password) {
  FirebaseAuth auth = FirebaseAuth.instance;
  return auth
      .createUserWithEmailAndPassword(email: username, password: password)
      .then((value) => "")
      .catchError((error) => error.toString());
}

Future<dynamic> getUsersAdminPriv(String username) async {
  dynamic data;

  await FirebaseFirestore.instance
      .collection('users')
      .doc(username)
      .get()
      .then((DocumentSnapshot documentSnapshot) {
    if (documentSnapshot.exists) {
      data = documentSnapshot.get("is_admin");
    } else {
      data = null;
    }
  });

  return data;
}

Future<String> getUsersToken(String username) async {
  dynamic data;

  await FirebaseFirestore.instance
      .collection('users')
      .doc(username)
      .get()
      .then((DocumentSnapshot documentSnapchat) {
    if (documentSnapchat.exists) {
      data = documentSnapchat.get("token");
    } else {
      data = "";
    }
  });

  return data;
}

Future<String> updateUsersToken(String username, String token) {
  CollectionReference users = FirebaseFirestore.instance.collection('users');
  return users
      .doc(username)
      .update({'token': token})
      .then((value) => "")
      .catchError((error) => error.toString());
}

Future<String> signinUser(username, password) async {
  String errorMessage = "";

  // sign-in using auth
  User? authUser;
  try {
    UserCredential result = await auth.signInWithEmailAndPassword(
        email: username, password: password);
    authUser = result.user;
  } catch (error) {
    errorMessage = error.toString();
    return errorMessage;
  }

  // get projectId and subscribe to project
  dynamic userProjects;

  userProjects = await getUsersProjectList(username);
  if (userProjects == null) {
    errorMessage = "Unable to find user in database";
    return errorMessage;
  }

  //subscribe user to project
  bool subscribeCheck = await subscribeToProjectTopic(userProjects);
  if (!subscribeCheck) {
    errorMessage =
        "Could not subscribe user to project using ID(s) in database.";
    return errorMessage;
  }

  //Update the user's token if it is new
  String token = await getUsersToken(username);
  if (token == "") {
    errorMessage = "Could not get the user's token.";
    return errorMessage;
  } else if (token != await FirebaseMessaging.instance.getToken()) {
    String? newToken = await FirebaseMessaging.instance.getToken();
    String check = await updateUsersToken(username, newToken!);
    if (check != "") {
      errorMessage = "Could not update the user's token.";
      return errorMessage;
    }
  }

  // if no errors, instantiate user instance
  InternalUser.instance(user: authUser, projectId: userProjects);

  return "";
}
