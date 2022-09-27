import json
from django.test import TestCase
from django.test import TestCase
from django.contrib.auth.models import User
from django.test import Client
from django.http import JsonResponse

from .models import DynamicModel


class UserTestCase(TestCase):
    def setUp(self):
        User.objects.create_user("blake", "Blake@blake.com", "BlakeMan")
        User.objects.create_user("tim", "tim@gmail.com", "1234567")
        User.objects.create_user("password",
                                 "password@email.com", "badPassword")
        DynamicModel.objects.create(lat = [1,2,3,4,5,6,7,8],
                    long = [1,2,3,4,5,6,7,8],
                    ele = [1,2,3,4,5,6,7,8],
                    distance = [1,2,3,4,5,6,7,8],
                    bearing = [1,2,3,4,5,6,7,8],
                    slope = [1,2,3,4,5,6,7,8])
        
        DynamicModel.objects.create(lat = [2,2,3,4,5,6,7,8],
                    long = [1,2,3,4,5,6,7,8],
                    ele = [1,2,3,4,5,6,7,8],
                    distance = [1,2,3,4,5,6,7,8],
                    bearing = [1,2,3,4,5,6,7,8],
                    slope = [1,2,3,4,5,6,7,8])

    def test_usernames(self):
        blake = User.objects.get(username="blake")
        tim = User.objects.get(username="tim")
        self.assertEqual(blake.email, 'Blake@blake.com')
        self.assertEqual(tim.email, 'tim@gmail.com')
    
    def test_dynamic_model(self):
        gpxData = DynamicModel.objects.get(pk=1)
        self.assertEqual(gpxData.lat, [1,2,3,4,5,6,7,8])
        gpxData = DynamicModel.objects.get(pk=2)
        self.assertEqual(gpxData.lat, [2,2,3,4,5,6,7,8])

    def test_register(self):
        client = Client()
        data = {'username': 'john', 'email': 'john@email', 'password': 'smith'}
        response = client.post('/api/register/',
                               data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_login(self):
        client = Client()
        data = {'username': 'blake', 'password': 'BlakeMan'}
        response = client.post('/api/login/',
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

        response = client.put('/api/user/me/',
                              data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_user_password_update(self):
        client = Client()

        # Login so appropriate cookies are set
        client.login(username="blake", password="BlakeMan")

        data = {
            'currentPassword': 'BlakeMan',
            'newPassword': 'password3'
        }

        response = client.put('/api/user/me/password/',
                              data, content_type='application/json')
        self.assertEqual(response.status_code, 200)

    def test_logout(self):
        client = Client()

        # Login so appropriate cookies are set
        client.login(username="blake", password="BlakeMan")

        response = client.post('/api/logout/',
                               content_type='application/json')
        self.assertEqual(response.status_code, 200)

    """ def test_get_user(self):
        client = Client()
        data = {'email': 'tim@gmail.com'}
        response = client.get('/api/user/get/',data,content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.body)
        id = data["id"]
        self.assertEqual(id,2) """