# -*- encoding: utf-8 -*-
"""
Copyright (c) 2019 - present AppSeed.us
"""

from django.test import TestCase

# Create your tests here.
from django.test import TestCase
from example import *

class testTeaseCase(TestCase):
# Create your tests here.
    def test_testingpytest(self):
        self.assertEqual(testingpytest(2, 2), 4)

    def test_testingpytestbad(self):
        self.assertEqual(testingpytest(2, 2), 5)