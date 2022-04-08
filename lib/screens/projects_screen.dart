import 'package:ema/screens/user_project_id_screen.dart';
import 'package:ema/utils/global_funcs.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
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

  void initializeSharedPrefs() async {
    final prefs = await SharedPreferences.getInstance();
    List<dynamic> dynamicList =
        await getUsersProjectList(FirebaseAuth.instance.currentUser!.email!);
    List<String> list = dynamicList.cast<String>();

    setState(() {
      _SharedPrefs = prefs;
      _SharedPrefs.setStringList('projects', list);
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

      //this block removes the project from the list on the page
      for (final n in projects) {
        if (n != project) {
          newProjectList.add(n);
        }
      }
      _SharedPrefs.setStringList("projects", newProjectList);
      updateProjectList();

      //removes the project from the user and project collection in firebase
      String error = await removeUserFromProject(
          FirebaseAuth.instance.currentUser!.email!, project);
      if (error != "") {
        throw error;
      }
    }

    //This part returns the actual widget, along with a pointer to the tap function
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
                icon: const Icon(
                  Icons.delete,
                  color: Colors.black54,
                ),
                onPressed: () => showDialog<void>(
                      context: context,
                      barrierDismissible: false, // user must tap button!
                      builder: (BuildContext context) {
                        return AlertDialog(
                          title: const Text('Warning'),
                          content: SingleChildScrollView(
                            child: ListBody(
                              children: const <Widget>[
                                Text(
                                    'Are you sure you wish to remove yourself from this project?'),
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
                            TextButton(
                              child: const Text('Cancel'),
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
        actions: <Widget>[
          Padding(
              padding: const EdgeInsets.only(right: 20.0),
              child: GestureDetector(
                  onTap: () {
                    // TODO: navigate to new page where you can subscribe to new topic
                    //Navigator.push(context, MaterialPageRoute(builder: (context) => projectpagehere()))
                  },
                  child: const Icon(Icons.add)))
        ],
      ),

      // body is majority of the screen
      body: Center(
        child: Column(
          children: [
            const Padding(
                padding: EdgeInsets.all(10.0),
                child: Text('Manage Projects',
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
