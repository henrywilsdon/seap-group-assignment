
import json
import xmltodict
import geojson
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

    def test_files(self):
        client = Client()

        client.login(username="blake", password="BlakeMan")

        filepath = "GPX example files/Tokyo-Olympics-Men's-ITT_track.gpx"
        with open(filepath) as gpx:
            response = client.post('/api/upload/', {'attachment': gpx})

        data = json.loads(response.content)
        #name = data["name"]
        self.assertEqual(response.status_code, 200)   

    def test_full_cycle(self):
        client = Client()

        client.login(username="blake", password="BlakeMan")

        filepath = "GPX example files/Tokyo-Olympics-Men's-ITT_track.gpx"

        with open(filepath) as gpx:
            response = client.post('/api/upload/', {'attachment': gpx})

        data = json.loads(response.content)
        data['horizontal_distance_to_last_point'][0]=0.0

        course_data = {
                'name':'test',
                'location':'adelaide',
                'last_updated':'2022-01-01 01:00',
                'gps_geo_json':data
        }

        response = client.post('/api/course/', course_data, content_type='application/json')
        
        all_parameter_data = {
            "athlete_parameters": {
                "id": 1,
                "name": "test",
                "rider_mass": 71,
                "bike_mass": 7,
                "other_mass": 1,
                "total_mass": 79,
                "CP_FTP": 430,
                "W_prime": 35000
            },
            "environment_parameters": {
                "wind_density" : 1.13,
                "wind_direction" : 30,
                "wind_speed_mps" : 2
            },
            "mechanical_parameters": {
                "crr": 0.0025,
                "mechanical_efficiency": 0.98,
                "mol_whl_front": 0.08,
                "mol_whl_rear": 0.08,
                "wheel_radius": 0.335
            },
            "course_parameters": {
                "max_slope_threshold": 0.03,
                "min_slope_threshold": -0.01
            }
                
        }

        response = client.post('/api/prediction/1/', all_parameter_data, content_type='application/json')


        
