import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:ema/actions/project_actions.dart';
import 'package:ema/screens/projects_screen.dart';
import 'package:ema/screens/user_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import '../actions/login_actions.dart';
import '../screens/projects_screen.dart';

class AddProjectPage extends StatelessWidget {
  TextEditingController projectIdController = TextEditingController();

  AddProjectPage({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Add Project')),
      // body is majority of the screen
      body: Center(
          child: Column(children: [
        Flexible(
          flex: 3,
          child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: TextField(
                key: const Key("project-ID"),
                controller: projectIdController,
                decoration: const InputDecoration(
                  border: OutlineInputBorder(),
                  labelText: 'Project ID',
                ),
              )),
        ),
        Padding(
          padding: const EdgeInsets.all(20.0),
          child: TextButton(
            style: TextButton.styleFrom(
                padding: const EdgeInsets.all(20.0),
                primary: Colors.white,
                textStyle: const TextStyle(fontSize: 20),
                backgroundColor: Colors.blue),
            onPressed: () async {
              addProjectToUser(FirebaseAuth.instance.currentUser!.email!,
                  projectIdController.text);
              String error = "";
              if (error != "") {
                return showDialog<void>(
                  context: context,
                  barrierDismissible: false, // user must tap button!
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: const Text('Error: Project Does Not Exist'),
                      content: SingleChildScrollView(
                        child: ListBody(
                          children: <Widget>[
                            Text(error),
                          ],
                        ),
                      ),
                      actions: <Widget>[
                        TextButton(
                          child: const Text('Dismiss'),
                          onPressed: () {
                            Navigator.push(
                                context,
                                MaterialPageRoute(
                                    builder: (context) =>
                                        const ProjectsPage()));
                          },
                        ),
                      ],
                    );
                  },
                );
              }
            },
            child: const Text('Sign Up'),
          ),
        ),
      ])),
    );
  }
}
