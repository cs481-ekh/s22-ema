// File generated by FlutterFire CLI.
// ignore_for_file: lines_longer_than_80_chars
import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:flutter/foundation.dart'
    show defaultTargetPlatform, kIsWeb, TargetPlatform;

/// Default [FirebaseOptions] for use with your Firebase apps.
///
/// Example:
/// ```dart
/// import 'firebase_options.dart';
/// // ...
/// await Firebase.initializeApp(
///   options: DefaultFirebaseOptions.currentPlatform,
/// );
/// ```
class DefaultFirebaseOptions {
  static FirebaseOptions get currentPlatform {
    if (kIsWeb) {
      throw UnsupportedError(
        'DefaultFirebaseOptions have not been configured for web - '
        'you can reconfigure this by running the FlutterFire CLI again.',
      );
    }
    // ignore: missing_enum_constant_in_switch
    switch (defaultTargetPlatform) {
      case TargetPlatform.android:
        return android;
      case TargetPlatform.iOS:
        return ios;
      case TargetPlatform.macOS:
        throw UnsupportedError(
          'DefaultFirebaseOptions have not been configured for macos - '
          'you can reconfigure this by running the FlutterFire CLI again.',
        );
    }

    throw UnsupportedError(
      'DefaultFirebaseOptions are not supported for this platform.',
    );
  }

  static const FirebaseOptions android = FirebaseOptions(
    apiKey: 'AIzaSyDbkY9rfPHCnbIgGzW0vHUKInwJiP0R114',
    appId: '1:655509160020:android:015ac4815acfd46c962dc1',
    messagingSenderId: '655509160020',
    projectId: 'ema-ramen',
    databaseURL: 'https://ema-ramen-default-rtdb.firebaseio.com',
    storageBucket: 'ema-ramen.appspot.com',
  );

  static const FirebaseOptions ios = FirebaseOptions(
    apiKey: 'AIzaSyAMDtPnuc6yGiNOAtLVQFXZ5I2JTGdlYO8',
    appId: '1:655509160020:ios:1789ea9cbcbbd729962dc1',
    messagingSenderId: '655509160020',
    projectId: 'ema-ramen',
    databaseURL: 'https://ema-ramen-default-rtdb.firebaseio.com',
    storageBucket: 'ema-ramen.appspot.com',
    androidClientId: '655509160020-7cr3k1cjtl75mnmcc13mtgb5arhqls8s.apps.googleusercontent.com',
    iosClientId: '655509160020-58jbj2rvfnkbcg6n4qkqkku78peivo4t.apps.googleusercontent.com',
    iosBundleId: 'com.team.ema',
  );
}
