import json
from django.test import TestCase
from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.http import JsonResponse


class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user("blake", "Blake@blake.com", "BlakeMan")
        User.objects.create_user("tim", "tim@gmail.com", "1234567")
        User.objects.create_user("password",
                                 "password@email.com", "badPassword")

    def test_usernames(self):
        blake = User.objects.get(username="blake")
        tim = User.objects.get(username="tim")
        self.assertEqual(blake.email, 'Blake@blake.com')
        self.assertEqual(tim.email, 'tim@gmail.com')

    def test_register(self):
        client = Client()
        data = {'username': 'john', 'email': 'john@email', 'password': 'smith'}
        response = client.post('/server_functions/register/',
                               data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        client = Client()
        data = {'username': 'blake', 'password': 'BlakeMan'}
        response = client.post('/server_functions/login/',
                               data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_user_update(self):
        client = Client()

        # Login so appropriate cookies are set
        client.login(username="blake", password="BlakeMan")

        data = {
            'email': 'jack@email.com',
            'username': 'jack'
        }

        response = client.put('/server_functions/user/me/',
                              data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        client = Client()

        # Login so appropriate cookies are set
        client.login(username="blake", password="BlakeMan")

        response = client.post('/server_functions/logout/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

    """ def test_get_user(self):
        client = Client()
        data = {'email': 'tim@gmail.com'}

        response = client.get('/server_functions/user/get/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.body)
        id = data["id"]
        self.assertEqual(id,2) """
