import 'package:cloud_firestore/cloud_firestore.dart';

Future<dynamic> getUsersProjectList(String username) async {
  dynamic data = [];

  await FirebaseFirestore.instance
      .collection('users')
      .doc(username)
      .get()
      .then((DocumentSnapshot documentSnapshot) {
    if (documentSnapshot.exists) {
      data = documentSnapshot.get("projectId");
    } else {
      data = null;
    }
  });

  return data;
}

Future<List<dynamic>> getProjectParticipants(String project) async {
  List<dynamic> data = List.empty();

  await FirebaseFirestore.instance
      .collection('projects')
      .doc(project)
      .get()
      .then((DocumentSnapshot documentSnapchat) {
    if (documentSnapchat.exists) {
      data = documentSnapchat.get("participants");
    }
  });

  return data;
}

Future<bool> checkProjectIdExists(String projectId) async {
  bool check = true;

  check = await FirebaseFirestore.instance
      .collection('projects')
      .doc(projectId)
      .get()
      .then((DocumentSnapshot documentSnapshot) {
    if (documentSnapshot.exists) {
      return true;
    } else {
      return false;
    }
  });

  return check;
}

Future<bool> addUserToParticipants(String email, List<String> projList) async {
  bool passed = true;
  CollectionReference projects =
      FirebaseFirestore.instance.collection('projects');
  for (String project in projList) {
    List<dynamic> participants = await getProjectParticipants(project);
    if (participants.isEmpty) {
      return false;
    }
    participants.add(email);
    projects
        .doc(project)
        .update({"participants": participants})
        .then((passed) => true)
        .catchError((passed) => false);
  }
  return passed;
}

Future<String> removeUserFromProject(String email, String projectId) async {
  String error = "";
  if (await removeProjectIdFromUser(email, projectId) == "failed") {
    error = "Could not remove the projectId from the user collection.";
    return error;
  }
  if (await removeUserFromParticipants(email, projectId) == "failed") {
    error = "Could not remove the user from the project participants list.";
    return error;
  }
  return error;
}

Future<dynamic> removeUserFromParticipants(
    String email, String projectId) async {
  dynamic ret;
  List<dynamic> data;
  data = await getProjectParticipants(projectId);
  if (data.contains(email)) {
    data.remove(email);
  } else {
    ret = "nothing";
  }
  CollectionReference projects =
      FirebaseFirestore.instance.collection('projects');
  projects
      .doc(projectId)
      .update({"participants": data})
      .then((_) => {ret = "success"})
      .catchError((_) => {ret = "failed"});

  return ret;
}

Future<dynamic> removeProjectIdFromUser(String email, String projectId) async {
  dynamic ret;
  List<dynamic> data;
  data = await getUsersProjectList(email);
  data.remove(projectId);
  CollectionReference projects = FirebaseFirestore.instance.collection('users');
  projects
      .doc(email)
      .update({"projectId": data})
      .then((_) => {ret = "success"})
      .catchError((_) => {ret = "failed"});
  return ret;
}
