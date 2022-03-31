import 'dart:convert';
import 'package:ema/utils/global_funcs.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:intl/intl.dart';
import 'package:url_launcher/url_launcher.dart';
import '../actions/notification_actions.dart';

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
    setState(() {
      _SharedPrefs = prefs;
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
    final notifJSON = projects[index];
    final nObject = jsonDecode(notifJSON);

    //["id":idnumber,"received":time,"title":"Test","body":"This is a test notification","url":"test.com",]
    final dateReceived = DateTime.parse(nObject['received']);
    final notifInfo = '${nObject['title']} : ${nObject['body']}';
    final url = nObject['url'];
    final dateString = DateFormat('yyyy-MM-dd – h:mm a').format(dateReceived);
    final projectID = '${nObject['projectID']}';
    //In order to properly access the url object, this needs to be initialized here unfortunately
    //Against everything I understand about Dart, it works so I'm not too worried
    //If you can find another way to do it let me know
    void openNotif() async {
      var newNotifList = <String>[];
      bool messageCheck = true;

      for (final n in projects) {
        if (messageCheck) {
          final temp = jsonDecode(n);
          //Checks the message id, filters out the handled message to remove from storage
          if (temp['id'] == nObject['id']) {
            messageCheck = false;
          } else {
            newNotifList.add(n);
          }
        } else {
          //Once we've found the matching message doing unnecessary json decoding is slow
          newNotifList.add(n);
        }
      }

      _SharedPrefs.setStringList("missedNotifs", newNotifList);

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
                    text: notifInfo,
                  ),
                  TextSpan(
                      text: "\n" + projectID,
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                ],
              ),
            ),
            subtitle: Text(dateString),
            onTap: openNotif,
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
                              child: const Text('Dismiss'),
                              onPressed: () {
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
