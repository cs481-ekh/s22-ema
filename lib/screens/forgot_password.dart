import 'package:flutter/cupertino.dart';
import 'package:flutter/material.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:ema/utils/data_classes.dart';

class MyStatefulWidget extends StatefulWidget {
  final TextEditingController usernameController;
  MyStatefulWidget({Key? key, required this.usernameController})
      : super(key: key);
  @override
  State<MyStatefulWidget> createState() => ForgotPassword(usernameController);
}

class ForgotPassword extends State<MyStatefulWidget> {
  static String id = 'forgot-password';
  String _email = "";
  final TextEditingController usernameController;

  ForgotPassword(this.usernameController);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.lightBlueAccent,
      body: Form(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 30.0),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'Email Your Email',
                style: TextStyle(fontSize: 30, color: Colors.white),
              ),
              TextFormField(
                controller: usernameController,
                onSaved: (newEmail) {
                  _email = newEmail!;
                },
                style: const TextStyle(color: Colors.white),
                decoration: const InputDecoration(
                  labelText: 'Email',
                  icon: Icon(
                    Icons.mail,
                    color: Colors.white,
                  ),
                  errorStyle: TextStyle(color: Colors.white),
                  labelStyle: TextStyle(color: Colors.white),
                  hintStyle: TextStyle(color: Colors.white),
                  focusedBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                  enabledBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                  errorBorder: UnderlineInputBorder(
                    borderSide: BorderSide(color: Colors.white),
                  ),
                ),
              ),
              const SizedBox(height: 20),
              RaisedButton(
                child: const Text('Send Email'),
                onPressed: () {
                  passwordReset();
                  print(_email);
                },
              ),
              FlatButton(
                child: const Text('Sign In'),
                onPressed: () {
                  Navigator.pop(context);
                },
              )
            ],
          ),
        ),
      ),
    );
  }

  Future passwordReset() async {
    String errorMessage = "";
    try {
      final _auth = FirebaseAuth.instance;
      await _auth.sendPasswordResetEmail(email: usernameController.text.trim());
    } catch (error) {
      errorMessage = error.toString();
    }
  }
}
