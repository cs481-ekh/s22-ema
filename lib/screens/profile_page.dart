import 'dart:async';

import 'package:ema/utils/data_classes.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter/cupertino.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../actions/project_actions.dart';
import '../utils/global_funcs.dart';
import 'edit_password.dart';

// This class handles the Page to dispaly the user's info on the "Edit Profile" Screen
class ProfilePage extends StatefulWidget {
  @override
  _ProfilePageState createState() => _ProfilePageState();
}

class _ProfilePageState extends State<ProfilePage> {
  late SharedPreferences _SharedPrefs;
  String? userEmail = "";

  void initializeSharedPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    //List<dynamic> dynamicList =
    //   await getUserEmail(FirebaseAuth.instance.currentUser!.email!);
    //List<String> list = dynamicList.cast<String>();
    userEmail = FirebaseAuth.instance.currentUser!.email;
    print("email: " + userEmail!);
    setState(() {
      _SharedPrefs = prefs;
    });
  }

  @override
  void initState() {
    initializeSharedPrefs();
    //initializeMessageHandler();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    startUserAuthListener(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Account'),
      ),

      // body is majority of the screen
      body: Center(
        child: Column(children: [
          const Padding(
              padding: EdgeInsets.all(10.0),
              child: Text('Email',
                  style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue))),
          buildUserInfoDisplay(userEmail!),
          const Padding(
              padding: EdgeInsets.all(10.0),
              child: Text('Password',
                  style: TextStyle(
                      fontSize: 20.0,
                      fontWeight: FontWeight.bold,
                      color: Colors.blue))),
          buildUserPasswordDisplay("Change Password?"),
        ]),
      ),
    );
  }

  Widget buildUserInfoDisplay(String getValue) => Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 1,
          ),
          Container(
              width: 350,
              height: 40,
              decoration: BoxDecoration(
                  border: Border(
                      bottom: BorderSide(
                color: Colors.grey,
                width: 1,
              ))),
              child: Row(children: [
                Expanded(
                    child: TextButton(
                        onPressed: () {
                          //Do nothing
                          //Could add function to open another screen and update email but you can't update a document (user name) in firestore
                          //Could have users create a non-email username during sign-up, and then could add feature to update email
                        },
                        child: Text(
                          getValue,
                          style: TextStyle(fontSize: 16, height: 1.4),
                        ))),
              ]))
        ],
      ));

  Widget buildUserPasswordDisplay(String getValue) => Padding(
      padding: EdgeInsets.only(bottom: 10),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            height: 1,
          ),
          Container(
              width: 350,
              height: 40,
              decoration: BoxDecoration(
                  border: Border(
                      bottom: BorderSide(
                color: Colors.grey,
                width: 1,
              ))),
              child: Row(children: [
                Expanded(
                    child: TextButton(
                        onPressed: () {
                          navigateSecondPage(EditPasswordFormPage());
                        },
                        child: Text(
                          getValue,
                          style: TextStyle(fontSize: 16, height: 1.4),
                        ))),
                Icon(
                  Icons.keyboard_arrow_right,
                  color: Colors.grey,
                  size: 40.0,
                )
              ]))
        ],
      ));

  // Handles navigation and prompts refresh.
  void navigateSecondPage(Widget editForm) {
    Route route = MaterialPageRoute(builder: (context) => editForm);
    Navigator.push(context, route);
  }
}
