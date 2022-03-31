import 'dart:convert';
import 'package:ema/utils/global_funcs.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../actions/notification_actions.dart';
import '../actions/project_actions.dart';

/// User screen, not as separated as I'd like; lots of state management stuff,
/// so ran into issues.
/// Would like to separate out notification list into own file.
/// Other applicable methods in actions/notifications_actions.dart

class ProjectsPage extends StatefulWidget {
  const ProjectsPage({Key? key}) : super(key: key);

  @override
  _ProjectsPageState createState() => _ProjectsPageState();
}

class _ProjectsPageState extends State<ProjectsPage> {
  late SharedPreferences _SharedPrefs;
  List<String> projects = [];
  int projectAmount = 0;

/*
  void initializeMessageHandler() async {
    FirebaseMessaging.onMessage.listen(handleForegroundNotif);
  }
  */

  void initializeSharedPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    List<dynamic> test =
        await getUsersProjectList(FirebaseAuth.instance.currentUser!.email!);
    List<String> help = test.cast<String>();

    setState(() {
      _SharedPrefs = prefs;
      _SharedPrefs.setStringList('projects', help);
    });
    updateProjectList();
  }

  void updateProjectList() {
    setState(() {
      projects = _SharedPrefs.getStringList("projects") ?? [];
    });
    setState(() {
      projectAmount = projects.length;
    });
    print("Updated project list!");
  }

  //This function defines the widget built into the ListView
  Widget listViewHelper(BuildContext context, int index) {
    final project = projects[index];

    void removeProject() async {
      var newProjectList = <String>[];

      for (final n in projects) {
        if (n != project) {
          newProjectList.add(n);
        }
      }

      _SharedPrefs.setStringList("projects", newProjectList);

      updateProjectList();
    }

    var screenSize = MediaQuery.of(context).size;

    //This part returns the actual widget, along with a pointer to the tap function
    //Displays notification data (Title, Body, ProjectID, ExpireDate)
    return Card(
        child: ListTile(
            title: RichText(
              text: TextSpan(
                style: const TextStyle(
                  color: Colors.black,
                ),
                children: <TextSpan>[
                  TextSpan(
                    text: project,
                  ),
                ],
              ),
            ),
            //subtitle: Text(dateString),
            trailing: IconButton(
                icon: Image.asset("assets/images/logo.png"),
                iconSize: screenSize.height * 0.125,
                onPressed: () => showDialog<void>(
                      context: context,
                      barrierDismissible: false, // user must tap button!
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text('Congratulations!'),
                          content: SingleChildScrollView(
                            child: ListBody(
                              children: const <Widget>[
                                Text('Hello'),
                              ],
                            ),
                          ),
                          actions: <Widget>[
                            TextButton(
                              child: const Text('Ok'),
                              onPressed: () {
                                removeProject();
                                Navigator.of(context).pop();
                              },
                            ),
                          ],
                        );
                      },
                    ))));
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
        title: const Text('Your Projects'),
        // leading: IconButton(
        //     icon: const Icon(Icons.arrow_back),
        //     onPressed: () {
        //       Navigator.of(context).popUntil((route) => route.isFirst);
        //     }),
      ),

      // body is majority of the screen
      body: Center(
        child: Column(
          children: [
            const Padding(
                padding: EdgeInsets.all(10.0),
                child: Text('Projects',
                    style: TextStyle(
                        fontSize: 20.0,
                        fontWeight: FontWeight.bold,
                        color: Colors.blue))),
            Flexible(
                flex: 5,
                child: Padding(
                    padding: const EdgeInsets.all(5.0),
                    child: ListView.builder(
                        padding: const EdgeInsets.all(5),
                        itemCount: projectAmount,
                        scrollDirection: Axis.vertical,
                        shrinkWrap: true,
                        itemBuilder: listViewHelper))),
          ],
        ),
      ),
    );
  }
}
