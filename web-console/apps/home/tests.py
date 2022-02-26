# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""
from django.contrib.auth import get_user_model, authenticate
from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from example import *

class testTeaseCase(TestCase):
# Create your tests here.
    def test_testingpytest(self):
        self.assertEqual(testingpytest(2, 2), 4)

# This class is testing the Log in functionality in the models file to
# ensure database information is functioning with Admin user authenticates
class LoginTest(TestCase):

    # Creating a user in the database and saving the user to test authentication
    def setUp(self):
        self.user = get_user_model().objects.create_user(username='userTest1', password='pwtest1289', email='userTest@example.com')
        self.user.save()

    # When the tests are finished, delete the user(userTest) that was created
    def tearDown(self):
        self.user.delete()

    # User and Password credentials are correct, assert True
    def test_correct(self):
        user = authenticate(username='userTest', password='pwtest1289')
        self.assertTrue((user is not None) and user.is_authenticated)

    # Invalid username, assert False
    def test_wrong_username(self):
        user = authenticate(username='wrong', password='pwtest1289')
        self.assertFalse(user is not None and user.is_authenticated)

    # Invalid password, assert False
    def test_wrong_password(self):
        user = authenticate(username='userTest', password='wrong')
        self.assertFalse(user is not None and user.is_authenticated)

