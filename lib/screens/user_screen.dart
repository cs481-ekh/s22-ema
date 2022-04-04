import 'dart:convert';
import 'package:ema/screens/projects_screen.dart';
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

class UserPage extends StatefulWidget {
  const UserPage({Key? key}) : super(key: key);

  @override
  _UserPageState createState() => _UserPageState();
}

class _UserPageState extends State<UserPage> {
  late SharedPreferences _SharedPrefs;
  List<String> MissedNotifs = [];
  int notifAmount = 0;

  void initializeMessageHandler() async {
    FirebaseMessaging.onMessage.listen(handleForegroundNotif);
  }

  void initializeSharedPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    setState(() {
      _SharedPrefs = prefs;
    });
    updateMissedNotifs();
  }

  void updateMissedNotifs() {
    setState(() {
      MissedNotifs = _SharedPrefs.getStringList("missedNotifs") ?? [];
    });
    setState(() {
      notifAmount = MissedNotifs.length;
    });
    print("Updated notification list!");
  }

  void handleForegroundNotif(RemoteMessage message) async {
    print('Got a notification while in the foreground!');
    print('Message data: ${message.data}');

    if (message.notification != null) {
      print('Message also contained a notification: ${message.notification}');
    }

    await storeMessage(message);
    updateMissedNotifs();
  }

  //This function defines the widget built into the ListView
  Widget listViewHelper(BuildContext context, int index) {
    final notifJSON = MissedNotifs[index];
    final nObject = jsonDecode(notifJSON);

    //["id":idnumber,"received":time,"title":"Test","body":"This is a test notification","url":"test.com",]
    final dateReceived = DateTime.parse(nObject['received']);

    final notifInfo = '${nObject['title']} : ${nObject['body']}';
    final url = nObject['url'];
    final dateString = DateFormat('yyyy-MM-dd – h:mm a').format(dateReceived);
    final projectID = '${nObject['projectID']}';
    final expiration = '${nObject['expiration']}';
    //In order to properly access the url object, this needs to be initialized here unfortunately
    //Against everything I understand about Dart, it works so I'm not too worried
    //If you can find another way to do it let me know
    void openNotif() async {
      var newNotifList = <String>[];
      bool messageCheck = true;

      for (final n in MissedNotifs) {
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

      updateMissedNotifs();

      int streakCheck =
          await checkDate(FirebaseAuth.instance.currentUser?.email);
      //check for the click happening between 12-24 hours from the last click,
      //then update the clicked bool

      if (streakCheck == 1) {
        //clicked between 12-24 hours after the previous click
        incrementCount(FirebaseAuth.instance.currentUser?.email);
        displayCongrats();
      } else if (streakCheck == 0) {
        //clicked more than 24 hours after the previous click
        resetCount(FirebaseAuth.instance.currentUser?.email);
      }

      if (url != null) {
        if (await canLaunch(url)) {
          await launch(url);
        } else {
          throw "Could not launch $url";
        }
      }
    }

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
            TextSpan(
              text: "\n" + expiration,
            ),
          ],
        ),
      ),
      subtitle: Text(dateString),
      onTap: openNotif,
    ));
  }

  @override
  void initState() {
    initializeSharedPrefs();
    initializeMessageHandler();
    super.initState();
  }

  @override
  Widget build(BuildContext context) {
    startUserAuthListener(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text('EMA'),
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
                child: Text('Notifications',
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
                        itemCount: notifAmount,
                        scrollDirection: Axis.vertical,
                        shrinkWrap: true,
                        itemBuilder: listViewHelper))),
            Padding(
                padding: const EdgeInsets.all(20.0),
                child: TextButton(
                  style: TextButton.styleFrom(
                      padding: const EdgeInsets.all(20.0),
                      primary: Colors.white,
                      textStyle: const TextStyle(fontSize: 20),
                      backgroundColor: Colors.blue),
                  onPressed: () {
                    _SharedPrefs.setStringList("missedNotifs", []);
                    setState(() {
                      MissedNotifs = [];
                      notifAmount = 0;
                    });
                  },
                  child: const Text('Dismiss All'),
                )),
          ],
        ),
      ),
      drawer: Drawer(
        // Add a ListView to the drawer. This ensures the user can scroll
        // through the options in the drawer if there isn't enough vertical
        // space to fit everything.
        child: ListView(
          // Important: Remove any padding from the ListView.
          padding: EdgeInsets.zero,
          children: [
            const DrawerHeader(
              decoration: BoxDecoration(
                image: DecorationImage(
                    image: AssetImage('assets/images/sdp-logo-infinity.png')),
              ),
              child: Text('Menu',
                  style: TextStyle(
                      fontWeight: FontWeight.bold, color: Colors.white)),
            ),
            ListTile(
              title: const Text('Projects'),
              onTap: () {
                // Update the state of the app
                // ...
                // Then close the drawer
                Navigator.of(context).push(
                    MaterialPageRoute(builder: (context) => ProjectsPage()));
              },
            ),
            ListTile(
              title: const Text('Sign Out'),
              onTap: () {
                // Update the state of the app
                // ...
                // Then close the drawer
                signOut();
              },
            ),
          ],
        ),
      ),
    );
  }

  Future<void> displayCongrats() async {
    int test = await getCount(FirebaseAuth.instance.currentUser?.email);
    return showDialog<void>(
      context: context,
      barrierDismissible: false, // user must tap button!
      builder: (BuildContext context) {
        return AlertDialog(
          title: const Text('Congratulations!'),
          content: SingleChildScrollView(
            child: ListBody(
              children: <Widget>[
                Text('You have done at least one survey for ' +
                    test.toString() +
                    ' days in a row!'),
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
    );
  }
}
