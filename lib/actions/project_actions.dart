import 'package:cloud_firestore/cloud_firestore.dart';

Future<dynamic> getUsersProjectList(String username) async {
  dynamic data;

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
