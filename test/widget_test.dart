// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:ema/screens/login_screen.dart';
import 'package:firebase_auth_mocks/firebase_auth_mocks.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';
// ignore: implementation_imports
import 'package:firebase_auth_mocks/src/mock_user_credential.dart';

class MockNavigatorObserver extends Mock implements NavigatorObserver {}

final tUser = MockUser(
  isAnonymous: false,
  uid: 'T3STU1D',
  email: 'bob@thebuilder.com',
  displayName: 'Bob Builder',
  phoneNumber: '0800 I CAN FIX IT',
  photoURL: 'http://photos.url/bobbie.jpg',
  refreshToken: 'some_long_token',
);

final auth = MockFirebaseAuth(mockUser: tUser);

Future<MockUserCredential> createUserWithEmailAndPassword(
    {@required String? email, required String password}) async {
  return MockUserCredential(false, mockUser: tUser);
}

void main() {
  late NavigatorObserver mockObserver;
  setUp(() {
    WidgetsFlutterBinding.ensureInitialized();
    mockObserver = MockNavigatorObserver();
  });

  testWidgets('Test valid log in', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // better to load in specific class to test; just app() wasn't working

    // Widget testWidget = new MediaQuery(
    //     data: new MediaQueryData(),
    //     child: new MaterialApp(
    //         home: new LoginPage(
    //             usernameController: TextEditingController(),
    //             passwordController: TextEditingController(),
    //             projectIdController: TextEditingController(),
    //             adminProjectIdController: TextEditingController()),
    //         navigatorObservers: [mockObserver]));
    Widget testWidget = new MaterialApp(
        home: new LoginPage(
            usernameController: TextEditingController(),
            passwordController: TextEditingController(),
            projectIdController: TextEditingController()),
        navigatorObservers: [mockObserver]);
    await tester.pumpWidget(testWidget);

    final test = await auth.signInWithEmailAndPassword(
        email: "bob@builder.com", password: "T3STU1D");

    expect(test.user, tUser);
    // await tester.enterText(
    //     find.byKey(const Key("email-field")), 'bob@thebuilder.com');
    // await tester.enterText(find.byKey(const Key("password-field")), 'T3STU1D');
    // await tester.pump();
    // expect(find.text("bob@thebuilder.com"), findsOneWidget);
    // final button = find.byKey(const Key('login-button'));
    // expect(button, findsOneWidget);

    // await tester.pump(const Duration(milliseconds: 100));
    // await tester.tap(button);
    // await tester.pump();

    /// You'd also want to be sure that your page is now
    /// present in the screen.
    //expect(find.byType(UserPage), findsOneWidget);
    //expect(find.text("Login"), findsOneWidget);
  });
}
