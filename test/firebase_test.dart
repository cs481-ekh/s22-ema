import 'package:firebase_auth_mocks/firebase_auth_mocks.dart';
import 'package:test/test.dart';

final tUser = MockUser(
  isAnonymous: false,
  uid: 'T3STU1D',
  email: 'TestUser@testr.com',
  displayName: 'Testing',
  phoneNumber: '541 67 1234',
  photoURL:
      'https://cdn.pixabay.com/photo/2014/02/27/16/10/tree-276014__340.jpg',
  refreshToken: 'test_token_1514',
);

void main() {
  test('Returns no user if not signed in', () async {
    final auth = MockFirebaseAuth();
    final user = auth.currentUser;
    expect(user, isNull);
  });

  test('Returns a mocked user if already signed in', () async {
    final auth = MockFirebaseAuth(signedIn: true, mockUser: tUser);
    final user = auth.currentUser;
    expect(user, tUser);
  });

  test('Returns a hardcoded user token', () async {
    final auth = MockFirebaseAuth(signedIn: true, mockUser: tUser);
    final user = auth.currentUser!;
    final idToken = await user.getIdToken();
    expect(idToken, isNotEmpty);
  });

  test('User.reload returns', () async {
    final auth = MockFirebaseAuth(signedIn: true);
    final user = auth.currentUser;
    expect(user, isNotNull);
    // Does not throw an exception.
    await user!.reload();
  });
}
