import json
from django.test import TestCase
from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.http import JsonResponse

# Create your tests here.

class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user("Blake@blake.com", "Blake@blake.com", "BlakeMan")
        User.objects.create_user("tim@gmail.com", "tim@gmail.com", "1234567")
        User.objects.create_user("password@email.com","password@email.com", "badPassword")


    def test_usernames(self):
        blake = User.objects.get(username="Blake@blake.com")
        tim = User.objects.get(username="tim@gmail.com")
        self.assertEqual(blake.email, 'Blake@blake.com')
        self.assertEqual(tim.email, 'tim@gmail.com')

    def test_register(self):
        client = Client()
        data = {'username': 'john', 'email': 'john@email', 'password': 'smith'}
        response = client.post('/server_functions/register/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        client = Client()
        data = {'email': 'Blake@blake.com', 'password': 'BlakeMan'}
        response = client.post('/server_functions/login/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_password_update(self):
        client = Client()
        data = {'email': 'password@email.com', 'currentPassword': 'badPassword', 'newPassword': 'bestPassword'}

        response = client.put('/server_functions/user/me/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)

    
    def test_logout(self):
        client = Client()
        data = {'email': 'Blake@blake.com', 'password': 'BlakeMan'}

        response = client.post('/server_functions/login/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)

    """ def test_get_user(self):
        client = Client()
        data = {'email': 'tim@gmail.com'}

        response = client.get('/server_functions/user/get/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.body)
        id = data["id"]
        self.assertEqual(id,2) """
        
