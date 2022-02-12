// This is a basic Flutter widget test.
//
// To perform an interaction with a widget in your test, use the WidgetTester
// utility that Flutter provides. For example, you can send tap and scroll
// gestures. You can also use WidgetTester to find child widgets in the widget
// tree, read text, and verify that the values of widget properties are correct.

import 'package:ema/actions/login_actions.dart';
import 'package:ema/screens/login_screen.dart';
import 'package:ema/screens/user_project_id_screen.dart';
import 'package:ema/screens/user_screen.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_auth_mocks/firebase_auth_mocks.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mockito/mockito.dart';

import 'package:ema/main.dart';

class MockNavigatorObserver extends Mock implements NavigatorObserver {}

void main() {
  setUp(() {
    WidgetsFlutterBinding.ensureInitialized();
  });

  testWidgets('Test valid log in', (WidgetTester tester) async {
    // Build our app and trigger a frame.
    // better to load in specific class to test; just app() wasn't working
    final mockObserver = MockNavigatorObserver();

    Widget testWidget = new MediaQuery(
        data: new MediaQueryData(),
        child: new MaterialApp(
            home: new LoginPage(
                usernameController: TextEditingController(),
                passwordController: TextEditingController(),
                projectIdController: TextEditingController(),
                adminProjectIdController: TextEditingController()),
            navigatorObservers: [mockObserver]));
    await tester.pumpWidget(testWidget);

    await tester.enterText(
        find.byKey(const Key("email-field")), 'test1@gmail.com');
    await tester.enterText(find.byKey(const Key("password-field")), 'abc123');

    final button = find.byKey(const Key('login-button'));
    expect(button, findsOneWidget);
    await tester.tap(button);
    await tester.pumpAndSettle();

    /// You'd also want to be sure that your page is now
    /// present in the screen.
    expect(find.byType(UserPage), findsOneWidget);
    //expect(find.text("Login"), findsOneWidget);
  });
}
