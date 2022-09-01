from django.test import TestCase
from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.http import JsonResponse

# Create your tests here.

class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user("Blake", "Blake@blake.com", "BlakeMan")
        User.objects.create_user("Tim", "tim@gamil.com", "1234567")


    def test_usernames(self):
        blake = User.objects.get(username="Blake")
        tim = User.objects.get(username="Tim")
        self.assertEqual(blake.email, 'Blake@blake.com')
        self.assertEqual(tim.email, 'tim@gamil.com')

""" class LoginTestCase(TestCase):

    def setUp(self):
        User.objects.create_user("john", "johnsmith@gmail.com", "smith")
        c = Client()
        json = JsonResponse({'username': 'john', 'password': 'smith'})
        response = c.post('/login/', json) """