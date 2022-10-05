import pprint # used only for testing code
import xmltodict
import great_circle_calculator.great_circle_calculator as gcc
import geojson

from contextlib import redirect_stderr
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.views.decorators.http import require_POST, require_GET
from django.views.decorators.http import require_http_methods
""" from django.views.decorators.csrf import ensure_csrf_cookie
from django.middleware.csrf import get_token """
from api.models import *
from api.models import DynamicModel
from api.gpxParser import gpx_to_json

# Create your views here.


""" def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response """


def home(request):
    return HttpResponse('<p>home view</p>')


@require_POST
def register_view(request):
    user_data = json.loads(request.body)
    username = user_data["username"]
    email = user_data["email"]
    password = user_data["password"]

    if not username_exists(username):
        user = User.objects.create_user(username, email, password)
        if "first_name" in user_data:
            first_name = user_data["first_name"]
            user.first_name = first_name
        return JsonResponse({'detail': 'Successfully registered.'}, status=200)
    else:
        return JsonResponse({'detail': 'Username or email already in use'}, status=400)


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide email and password.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if user != None:
        login(request, user)
        return JsonResponse({
            'detail': 'Successfully logged in.',
            'sessionId': request.session.session_key
        }, status=200)
    else:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)


@require_POST
def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'}, status=200)


@require_http_methods(["PUT", "GET"])
def user_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    if request.method == "GET":
        return JsonResponse({
            'username': request.user.username,
            'email': request.user.email
        })
    elif request.method == "PUT":
        data = json.loads(request.body)

        request.user.username = data['username']
        request.user.email = data['email']
        request.user.save()
        return JsonResponse({'detail': 'Successfully updated user'}, status=200)


@require_http_methods(["PUT"])
def user_password_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    data = json.loads(request.body)
    currentPassword = data['currentPassword']
    newPassword = data['newPassword']

    user = authenticate(
        request, username=request.user.username, password=currentPassword)
    if user == None:
        return JsonResponse({'detail': 'Incorrect password'}, status=401)

    user.set_password(newPassword)
    user.save()
    return JsonResponse({'detail': 'Successfully changed password'}, status=200)


def athlete_view(request, athlete_id):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    if request.method == "GET":
        athlete = Athlete.objects.filter(id=athlete_id).values()
        return JsonResponse({'athlete': list(athlete)})

    elif request.method == "PUT":
        athlete_data = json.loads(request.body)
        name = athlete_data["name"]
        bike_mass = athlete_data["bike_mass"]
        rider_mass = athlete_data["rider_mass"]
        other_mass = athlete_data["other_mass"]
        total_mass = athlete_data["total_mass"]
        CP_FTP = athlete_data["CP_FTP"]
        W_prime = athlete_data["W_prime"]

        athlete = Athlete.objects.get(id=athlete_id)

        athlete.name = name
        athlete.bike_mass = bike_mass
        athlete.rider_mass = rider_mass
        athlete.other_mass = other_mass
        athlete.total_mass = total_mass
        athlete.CP_FTP = CP_FTP
        athlete.W_prime = W_prime

        athlete.save()

        if athlete.name == name:
            return JsonResponse({'detail': 'Successfully updated athlete'}, status=200)
        else:
            return JsonResponse({'detail': 'Could not update athlete'}, status=400)

    elif request.method == "DELETE":
        athlete = Athlete.objects.get(id=athlete_id)
        athlete.delete()
        return HttpResponse(status=200)


def all_athletes_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    if request.method == "GET":
        athletes = Athlete.objects.all().values()
        return JsonResponse({'athletes': list(athletes)})

    elif request.method == "POST":
        athlete_data = json.loads(request.body)
        name = athlete_data["name"]
        bike_mass = athlete_data["bike_mass"]
        rider_mass = athlete_data["rider_mass"]
        other_mass = athlete_data["other_mass"]
        total_mass = athlete_data["total_mass"]
        CP_FTP = athlete_data["CP_FTP"]
        W_prime = athlete_data["W_prime"]

        athlete = Athlete.objects.create(
            name=name,
            bike_mass=bike_mass,
            rider_mass=rider_mass,
            other_mass=other_mass,
            total_mass=total_mass,
            CP_FTP=CP_FTP,
            W_prime=W_prime
        )
        athlete.save()

        if athlete.name == name:
            return JsonResponse({'detail': 'Successfully added new athlete.'}, status=200)
        else:
            return JsonResponse({'detail': 'Could not add athlete'}, status=400)


""" @require_http_methods(["GET"])
def get_user_view(request):
    data = json.loads(request.body)
    username = data["email"]
    #password = data["password"]
    user = User.objects.get(username=username)
    if user.is_authenticated:
        id = request.user.id
        return JsonResponse({'id': '2'}, status=200)
    else: 
        return JsonResponse({'detail': 'Unauthorized'}, status=401) """

""" def registerPage(request):
    form = UserCreationForm()
    context = {'form':form}
    return render(request, 'register.html', context)
def csrf(request):
    return HttpResponse('check out this cookie') """


def username_exists(username):
    if User.objects.filter(username=username).exists():
        return True
    return False


def all_static_model_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    #get all static models
    if request.method == "GET":
        static_models = StaticModel.objects.all().values()
        return JsonResponse({'Static Model': list(static_models)})

    #add static model -- assumes, all these values are submitted with the same request
    if request.method == "POST":
        model_data = json.loads(request.body)

        bike_plus_rider_model = BikePlusRiderModel.objects.create(
            mass_rider = model_data["mass_rider"],
            mass_bike = model_data["mass_bike"],
            mass_other = model_data["mass_other"],
            crr = model_data["crr"],
            mechanical_efficiency = model_data["mechanical_efficiency"],
            mol_whl_front = model_data["mol_whl_front"],
            mol_whl_rear = model_data["mol_whl_rear"],
            wheel_radius = model_data["wheel_radius"]
        )
        cp_model = CPModel.objects.create(
            cp = model_data["cp"],
            w_prime = model_data["w_prime"],
            w_prime_recovery_function = model_data["w_prime_recovery_function"],
            below_steady_state_max_slope = model_data["below_steady_state_max_slope"],
            below_steady_state_power_usage = model_data["below_steady_state_power_usage"],
            over_threshold_min_slope = model_data["over_threshold_min_slope"],
            over_threshold_power_usage = model_data["over_threshold_power_usage"],
            steady_state_power_usage = model_data["steady_state_power_usage"]
        )
        position_model = PositionModel.objects.create(
            climbing_cda_increment = model_data["climbing_cda_increment"],
            climbing_min_slope = model_data["climbing_min_slope"],
            descending_cda_increment = model_data["descending_cda_increment"],
            descending_max_slope = model_data["descending_max_slope"]
        ) 
        environment_model = EnvironmentModel.objects.create(
            wind_direction = model_data["wind_direction"],
            wind_speed_mps = model_data["wind_speed_mps"],
            wind_density = model_data["wind_density"]
        )
        technical_model = TechnicalModel.objects.create(
            timestep_size = model_data["timestep_size"],
            starting_distance = model_data["starting_distance"],
            starting_speed = model_data["starting_speed"]
        )

        model = StaticModel.objects.create(
            bike_plus_rider_model = bike_plus_rider_model,
            cp_model = cp_model,
            position_model = position_model,
            environment_model = environment_model,
            technical_model = technical_model
        )
        model.save()


def static_model_view(request, gpx_model_id):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    if request.method == "GET":
        static_model = StaticModel.objects.filter(id=gpx_model_id).values()
        return JsonResponse({'Static Model': list(static_model)})

    if request.method == "PUT":
        model_data = json.loads(request.body)
        model = StaticModel.objects.get(id=gpx_model_id)
        
        model.bike_plus_rider_model.mass_rider = model_data["mass_rider"]
        model.bike_plus_rider_model.mass_bike = model_data["mass_bike"]
        model.bike_plus_rider_model.mass_other = model_data["mass_other"]
        model.bike_plus_rider_model.crr = model_data["crr"]
        model.bike_plus_rider_model.mechanical_efficiency = model_data["mechanical_efficiency"]
        model.bike_plus_rider_model.mol_whl_rear = model_data["mol_whl_rear"]
        model.bike_plus_rider_model.mol_whl_front = model_data["mol_whl_front"]
        model.bike_plus_rider_model.wheel_radius = model_data["wheel_radius"]

        model.cp_model.cp = model_data["cp"]
        model.cp_model.w_prime = model_data["w_prime"]
        model.cp_model.w_prime_recovery_function = model_data["w_prime_recovery_function"]
        model.cp_model.below_steady_state_max_slope = model_data["below_steady_state_max_slope"]
        model.cp_model.below_steady_state_power_usage = model_data["below_steady_state_power_usage"]
        model.cp_model.over_threshold_min_slope = model_data["over_threshold_min_slope"]
        model.cp_model.over_threshold_power_usage = model_data["over_threshold_power_usage"]
        model.cp_model.steady_state_power_usage = model_data["steady_state_power_usage"]

        model.position_model.climbing_min_slope = model_data["climbing_min_slope"]
        model.position_model.climbing_cda_increment = model_data["climbing_cda_increment"]
        model.position_model.descending_cda_increment = model_data["descending_cda_increment"]
        model.position_model.descending_max_slope = model_data["descending_max_slope"]

        model.environment_model.wind_density = model_data["wind_density"]
        model.environment_model.wind_direction = model_data["wind_direction"]
        model.environment_model.wind_speed_mps = model_data["wind_speed_mps"]

        model.technical_model.timestep_size = model_data["timestep_size"]
        model.technical_model.starting_speed = model_data["starting_speed"]
        model.technical_model.starting_distance = model_data["starting_distance"]

        model.save()

    if request.method == "DELETE":
        model = StaticModel.objects.get(id=gpx_model_id)
        model.delete()
        return HttpResponse(status=200)

        return True



def get_gpx_data(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)
    
    if request.method == 'POST':
        
        uploaded_file = request.FILES['attachment']
        gpx_json = gpx_to_json(uploaded_file)

        owner = request.user.username

        lat = []
        lon = []
        ele = []
        dis = []
        bear = []
        slope = []
        i = 0
        for key in gpx_json['segments'][0]:
            lat.append(gpx_json['segments'][0][i]['lat'])
            lon.append(gpx_json['segments'][0][i]['lon'])
            ele.append(gpx_json['segments'][0][i]['ele'])
            dis.append(gpx_json['segments'][0][i]['horz_dist_from_prev'])
            bear.append(gpx_json['segments'][0][i]['bearing_from_prev'])
            i = i + 1
        DynamicModel.objects.create(owner=owner,lat=lat,long=lon,ele=ele,distance=dis,bearing=bear,slope=slope)
        dynam = DynamicModel.objects.get(owner=owner)

        return JsonResponse({'detail': 'Successfully uploaded gpx data.', 'name': uploaded_file.name}, status=200)

    
