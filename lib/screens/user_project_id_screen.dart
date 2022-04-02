import 'package:ema/screens/user_screen.dart';
import 'package:flutter/material.dart';
import '../actions/login_actions.dart';

class ProjectIdPage extends StatelessWidget {
  final TextEditingController usernameController;
  final TextEditingController passwordController;
  final TextEditingController projectIdController;

  const ProjectIdPage(
      {Key? key,
      required this.usernameController,
      required this.passwordController,
      required this.projectIdController})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('EMA')),
      //This is just for testing and should be removed once a system is in
      //place to subscribe devices based on users
      // body is majority of the screen
      body: Center(
          child: Column(children: [
        Flexible(
          flex: 3,
          child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: TextField(
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
              String error = "";
              error = await addNewUser(
                  usernameController, passwordController, projectIdController);
              if (error != "") {
                return showDialog<void>(
                  context: context,
                  barrierDismissible: false, // user must tap button!
                  builder: (BuildContext context) {
                    return AlertDialog(
                      title: const Text('Error'),
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
                            Navigator.of(context).pop();
                          },
                        ),
                      ],
                    );
                  },
                );
              } else {
                Navigator.push(context,
                    MaterialPageRoute(builder: (context) => const UserPage()));
              }
            },
            child: const Text('Sign Up'),
          ),
        ),
      ])),
    );
  }
}
