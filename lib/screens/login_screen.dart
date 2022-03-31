import 'package:ema/screens/user_project_id_screen.dart';
import 'package:ema/screens/user_screen.dart';
import 'package:ema/utils/data_classes.dart';
import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import '../actions/login_actions.dart';
import 'forgot_password.dart';

class LoginPage extends StatelessWidget {
  final TextEditingController usernameController;
  final TextEditingController passwordController;
  final TextEditingController projectIdController;

  LoginPage({
    Key? key,
    required this.usernameController,
    required this.passwordController,
    required this.projectIdController,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    var screenSize = MediaQuery.of(context).size;
    return Scaffold(
      appBar: AppBar(
        title: const Text('EMA'),
        //This is just for testing and should be removed once a system is in
        //place to subscribe devices based on users
        // actions: <Widget>[
        //   PopupMenuButton(
        //     onSelected: onActionSelected,
        //     itemBuilder: (BuildContext context) {
        //       return [
        //         const PopupMenuItem(
        //           value: 'subscribe',
        //           child: Text('Subscribe to topic'),
        //         ),
        //         const PopupMenuItem(
        //           value: 'unsubscribe',
        //           child: Text('Unsubscribe to topic'),
        //         )
        //       ];
        //     },
        //   ),
        // ],
      ),
      // body is majority of the screen
      body: Center(
        child: Column(
          children: [
            Container(
                padding: const EdgeInsets.fromLTRB(20, 0, 0, 0),
                alignment: Alignment.topLeft,
                child: SizedBox(
                    height: screenSize.height * 0.115,
                    width: screenSize.width * 0.315,
                    child: IconButton(
                      icon: Image.asset('assets/images/sdp-logo-infinity.png'),
                      iconSize: screenSize.height * 0.125,
                      onPressed: () => showDialog<String>(
                        context: context,
                        builder: (BuildContext context) => AlertDialog(
                          title:
                              const Text('Senior Design Project Information'),
                          content: const Text(
                              'This website/app was created for a Boise State University Computer Science Senior Design Project by \n Paisley Davis \n Jeff Kahn \n Jason Kuphaldt \n Mason Humpherys \n Jonathan Tipton \n For information about sponsoring a project go to \n https://www.boisestate.edu/coen-cs/community/cs481-senior-design-project/'),
                          actions: <Widget>[
                            TextButton(
                              onPressed: () => Navigator.pop(context, 'OK'),
                              child: const Text('OK'),
                            ),
                          ],
                        ),
                      ),
                    ))),
            Flexible(
              flex: 3,
              child: Padding(
                padding: EdgeInsets.only(
                    top: screenSize.height * 0.015,
                    bottom: screenSize.height * 0.015,
                    left: screenSize.width * 0.07,
                    right: screenSize.width * 0.07),
                child: TextField(
                  key: const Key("email-field"),
                  controller: usernameController,
                  obscureText: false,
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    labelText: 'Email',
                  ),
                ),
              ),
            ),
            Flexible(
              flex: 3,
              child: Padding(
                  padding: EdgeInsets.only(
                      top: screenSize.height * 0.015,
                      bottom: screenSize.height * 0.015,
                      left: screenSize.width * 0.07,
                      right: screenSize.width * 0.07),
                  child: TextField(
                    key: const Key("password-field"),
                    controller: passwordController,
                    obscureText: true,
                    decoration: const InputDecoration(
                      border: OutlineInputBorder(),
                      labelText: 'Password',
                    ),
                  )),
            ),
            Flexible(
                flex: 3,
                child:
                    Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Padding(
                    padding: EdgeInsets.only(
                        top: screenSize.height * 0.015,
                        bottom: screenSize.height * 0.015,
                        left: screenSize.width * 0.07,
                        right: screenSize.width * 0.07),
                    child: TextButton(
                      key: const Key("login-button"),
                      style: TextButton.styleFrom(
                          padding: const EdgeInsets.only(
                              top: 10.0, bottom: 10.0, left: 10.0, right: 10.0),
                          primary: Colors.white,
                          textStyle: const TextStyle(fontSize: 20),
                          backgroundColor: Colors.blue),
                      onPressed: () async {
                        String userSigninCheck = await signinUser(
                            usernameController.text, passwordController.text);

                        if (userSigninCheck == "") {
                          // navigate to appropriate user page
                          InternalUser.setStoredInstance(
                              usernameController.text, passwordController.text);
                          Navigator.pushReplacement(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const UserPage()));
                        } else {
                          showDialog(
                              context: context,
                              builder: (BuildContext context) {
                                return AlertDialog(
                                  title: const Text("Error"),
                                  content: SingleChildScrollView(
                                    child: ListBody(
                                      children: <Widget>[
                                        Text(userSigninCheck),
                                      ],
                                    ),
                                  ),
                                  actions: <Widget>[
                                    TextButton(
                                      child: const Text('OK'),
                                      onPressed: () {
                                        Navigator.of(context).pop();
                                      },
                                    ),
                                  ],
                                );
                              });
                        }
                      },
                      child: const Text('Login'),
                    ),
                  ),
                  Padding(
                    padding: EdgeInsets.only(
                        top: screenSize.height * 0.015,
                        bottom: screenSize.height * 0.015,
                        left: screenSize.width * 0.07,
                        right: screenSize.width * 0.07),
                    child: TextButton(
                      style: TextButton.styleFrom(
                          padding: EdgeInsets.only(
                              top: screenSize.height * 0.02,
                              bottom: screenSize.height * 0.02,
                              left: screenSize.width * 0.05,
                              right: screenSize.width * 0.05),
                          primary: Colors.white,
                          textStyle: const TextStyle(fontSize: 20),
                          backgroundColor: Colors.blue),
                      onPressed: () async {
                        bool isEmpty = usernameController.text == '' &&
                            passwordController.text == '';
                        RegExp exp = RegExp(r"\w+@.*\.(edu|com)");
                        bool validEmail = exp.hasMatch(usernameController.text);
                        String error = "";
                        isEmpty
                            ? showDialog(
                                context: context,
                                builder: (BuildContext context) {
                                  return AlertDialog(
                                    title: const Text(
                                        "Empty Username or Password"),
                                    content: SingleChildScrollView(
                                      child: ListBody(
                                        children: const <Widget>[
                                          Text(
                                              "The required fields are empty."),
                                        ],
                                      ),
                                    ),
                                    actions: <Widget>[
                                      TextButton(
                                        child: const Text('OK'),
                                        onPressed: () {
                                          Navigator.of(context).pop();
                                        },
                                      ),
                                    ],
                                  );
                                })
                            : validEmail
                                ? error == ""
                                    ? Navigator.push(
                                        context,
                                        MaterialPageRoute(
                                            builder: (context) => ProjectIdPage(
                                                usernameController:
                                                    usernameController,
                                                passwordController:
                                                    passwordController,
                                                projectIdController:
                                                    projectIdController)))
                                    : showDialog(
                                        context: context,
                                        builder: (BuildContext context) {
                                          return AlertDialog(
                                            title: const Text(
                                                "Unable to register user."),
                                            content: SingleChildScrollView(
                                              child: ListBody(
                                                children: <Widget>[
                                                  Text(error),
                                                ],
                                              ),
                                            ),
                                            actions: <Widget>[
                                              TextButton(
                                                child: const Text('OK'),
                                                onPressed: () {
                                                  Navigator.of(context).pop();
                                                },
                                              ),
                                            ],
                                          );
                                        })
                                : showDialog(
                                    context: context,
                                    builder: (BuildContext context) {
                                      return AlertDialog(
                                        title: const Text("Email Invalid"),
                                        content: SingleChildScrollView(
                                          child: ListBody(
                                            children: const <Widget>[
                                              Text("Not a valid email."),
                                            ],
                                          ),
                                        ),
                                        actions: <Widget>[
                                          TextButton(
                                            child: const Text('OK'),
                                            onPressed: () {
                                              Navigator.of(context).pop();
                                            },
                                          ),
                                        ],
                                      );
                                    });
                      },
                      child: const Text('Sign Up'),
                    ),
                  ),
                ])),
            Flexible(
                flex: 3,
                child:
                    Row(mainAxisAlignment: MainAxisAlignment.center, children: [
                  Padding(
                    padding: const EdgeInsets.all(0.0),
                    child: TextButton(
                      style: TextButton.styleFrom(
                          padding: EdgeInsets.only(
                              top: screenSize.height * 0.02,
                              bottom: screenSize.height * 0.02,
                              left: screenSize.width * 0.10,
                              right: screenSize.width * 0.10),
                          primary: Colors.white,
                          textStyle: const TextStyle(fontSize: 20),
                          backgroundColor: Colors.blue),
                      onPressed: () {
                        Navigator.push(
                          context,
                          new MaterialPageRoute(
                            builder: (context) => MyStatefulWidget(
                                usernameController: usernameController),
                          ),
                        );
                      },
                      child: Text('Forgot Password'),
                    ),
                  ),
                ]))
          ],
        ),
      ),
    );
  }
}
