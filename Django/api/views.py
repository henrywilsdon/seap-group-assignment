import pprint # used only for testing code
import xmltodict
import great_circle_calculator.great_circle_calculator as gcc
import geojson

from api.predictiveModel import *
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

        

        model = StaticModel.objects.create(
            mass_rider = model_data["mass_rider"],
            mass_bike = model_data["mass_bike"],
            mass_other = model_data["mass_other"],
            delta_kg = 0,
            crr = model_data["crr"],
            mechanical_efficiency = model_data["mechanical_efficiency"],
            mol_whl_front = model_data["mol_whl_front"],
            mol_whl_rear = model_data["mol_whl_rear"],
            wheel_radius = model_data["wheel_radius"],

            
            cp = model_data["cp"],
            w_prime = model_data["w_prime"],
            w_prime_recovery_function = model_data["w_prime_recovery_function"],
            below_steady_state_max_slope = model_data["below_steady_state_max_slope"],
            below_steady_state_power_usage = model_data["below_steady_state_power_usage"],
            over_threshold_min_slope = model_data["over_threshold_min_slope"],
            over_threshold_power_usage = model_data["over_threshold_power_usage"],
            steady_state_power_usage = model_data["steady_state_power_usage"],

            climbing_cda_increment = model_data["climbing_cda_increment"],
            climbing_min_slope = model_data["climbing_min_slope"],
            descending_cda_increment = model_data["descending_cda_increment"],
            descending_max_slope = model_data["descending_max_slope"],

            wind_direction = model_data["wind_direction"],
            wind_speed_mps = model_data["wind_speed_mps"],
            wind_density = model_data["wind_density"],

            timestep_size = model_data["timestep_size"],
            starting_distance = model_data["starting_distance"],
            starting_speed = model_data["starting_speed"],

            delta_cda = 0,
            delta_watts = -20 
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
        
        model.mass_rider = model_data["mass_rider"]
        model.mass_bike = model_data["mass_bike"]
        model.mass_other = model_data["mass_other"]
        model.crr = model_data["crr"]
        model.mechanical_efficiency = model_data["mechanical_efficiency"]
        model.mol_whl_rear = model_data["mol_whl_rear"]
        model.mol_whl_front = model_data["mol_whl_front"]
        model.wheel_radius = model_data["wheel_radius"]

        model.cp = model_data["cp"]
        model.w_prime = model_data["w_prime"]
        model.w_prime_recovery_function = model_data["w_prime_recovery_function"]
        model.below_steady_state_max_slope = model_data["below_steady_state_max_slope"]
        model.below_steady_state_power_usage = model_data["below_steady_state_power_usage"]
        model.over_threshold_min_slope = model_data["over_threshold_min_slope"]
        model.over_threshold_power_usage = model_data["over_threshold_power_usage"]
        model.steady_state_power_usage = model_data["steady_state_power_usage"]

        model.climbing_min_slope = model_data["climbing_min_slope"]
        model.climbing_cda_increment = model_data["climbing_cda_increment"]
        model.descending_cda_increment = model_data["descending_cda_increment"]
        model.descending_max_slope = model_data["descending_max_slope"]

        model.wind_density = model_data["wind_density"]
        model.wind_direction = model_data["wind_direction"]
        model.wind_speed_mps = model_data["wind_speed_mps"]

        model.timestep_size = model_data["timestep_size"]
        model.starting_speed = model_data["starting_speed"]
        model.starting_distance = model_data["starting_distance"]

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
        segment = []
        roughness = []
        i = 0
        for key in gpx_json['segments'][0]:
            lat.append(gpx_json['segments'][0][i]['lat'])
            lon.append(gpx_json['segments'][0][i]['lon'])
            ele.append(gpx_json['segments'][0][i]['ele'])
            dis.append(gpx_json['segments'][0][i]['horz_dist_from_prev'])
            bear.append(gpx_json['segments'][0][i]['bearing_from_prev'])
            slope.append(gpx_json['segments'][0][i]['slope'])
            segment.append(0)
            roughness.append(2)
            i = i + 1
        dynam = DynamicModel.objects.create(owner=owner,lat=lat,long=lon,ele=ele,distance=dis,bearing=bear,slope=slope,segment=segment,roughness=roughness)

        return JsonResponse({
            'detail': 'Successfully uploaded gpx data.',
            'latitude': lat,
            'longitude': lon,
            'elevation': ele,
            'horizontal_distance_to_last_point': dis,
            'bearing_from_last_point': bear,
            'slope': slope,
            'segment': segment,
            'roughness': roughness
        }, status=200)


def all_courses_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    if request.method == "GET":
        courses = Course.objects.all().values()
        
        if Course.objects.all().exists():
            return JsonResponse({'All Courses:': list(courses)}, status=200)
        else:
            return JsonResponse({'detail': 'No courses exist'}, status=400)


    if request.method == "POST":
        course_data = json.loads(request.body)

        gps_json=course_data["gps_geo_json"]
        course = Course.objects.create(
            name=course_data["name"],
            location=course_data["location"],
            last_updated=course_data["last_updated"],
            gps_geo_json=DynamicModel.objects.create(
                owner=request.user.username,
                lat=gps_json['latitude'],
                long=gps_json['longitude'],
                ele=gps_json['elevation'],
                distance=gps_json['horizontal_distance_to_last_point'],
                bearing=gps_json['bearing_from_last_point'],
                slope=gps_json['slope'],
                segment=gps_json['segment'],
                roughness=gps_json['roughness'],
            ),
            min_slope_threshold = 0,
            max_slope_threshold = 0,
        )
        course.save()

        if course.name == course_data["name"]:
            return HttpResponse(status=200)
        else:
            return JsonResponse({'detail': 'Failed to add course'}, status=400)


def course_view(request, course_id):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)
    
    if request.method == "GET":
        course = Course.objects.get(id=course_id)

        if course != None:
            courseGps = DynamicModel.objects.get(id=course.gps_geo_json_id)
            return JsonResponse({'Course:': {
                'id': course.id,
                'name': course.name,
                'location': course.location,
                'last_updated': course.last_updated,
                'gps_geo_json': {
                    'latitude': courseGps.lat,
                    'longitude': courseGps.long,
                    'elevation': courseGps.ele,
                    'horizontal_distance_to_last_point': courseGps.distance,
                    'bearing_from_last_point': courseGps.bearing,
                    'slope': courseGps.slope,
                    'segment' : courseGps.segment,
                    'roughness' : courseGps.roughness,
                }
            }}, status=200)
        else:
            return JsonResponse({'detail': 'course does not exist'}, status=404)


    elif request.method == "PUT":
        course_data = json.loads(request.body)
        course = Course.objects.get(id=course_id)

        gps_json=course_data["gps_geo_json"]

        course.name = course_data["name"]
        course.location = course_data["location"]
        course.last_updated = course_data["last_updated"]
        course.gps_geo_json = DynamicModel.objects.create(
                owner=request.user.username,
                lat=gps_json['latitude'],
                long=gps_json['longitude'],
                ele=gps_json['elevation'],
                distance=gps_json['horizontal_distance_to_last_point'],
                bearing=gps_json['bearing_from_last_point'],
                slope=gps_json['slope'],
                segment=gps_json['segment'],
                roughness=gps_json['roughness']
            )
        #This will be updated in the later parameters view
        course.min_slope_threshold = 0
        course.max_slope_threshold = 0


        course.save()

        if course.name == course_data["name"]:
            return HttpResponse(status=200)
        else:
            return JsonResponse({'detail': 'Failed to update course'}, status=400)


    elif request.method == "DELETE":
        course = Course.objects.get(id=course_id)
        course.delete()

        if Course.objects.filter(id=course_id).exists():
            return JsonResponse({'detail': 'failed to delete course'}, status=400)
        else:
            return JsonResponse({'detail': 'course deleted'}, status=200)






def all_prediction_parameters(request, course_id):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'User not authenticated'}, status=401)

    course = Course.objects.get(id=course_id)



    if request.method == "POST":
        parameters = json.loads(request.body)

        #Unpack paramter boxes
        athlete_parameters = parameters["athlete_parameters"]
        environment_parameters = parameters["environment_parameters"]
        mechanical_parameters = parameters["mechanical_parameters"]
        course_parameters = parameters["course_parameters"]

        course.min_slope_threshold = course_parameters["min_slope_threshold"]
        course.max_slope_threshold = course_parameters["max_slope_threshold"]

        athlete = Athlete(
            name=athlete_parameters["name"],
            bike_mass=athlete_parameters["bike_mass"],
            rider_mass=athlete_parameters["rider_mass"],
            other_mass=athlete_parameters["other_mass"],
            total_mass=athlete_parameters["total_mass"],
            CP_FTP=athlete_parameters["CP_FTP"],
            W_prime=athlete_parameters["W_prime"],
        )

        """ 
        The parameters in this model can be changed depending on what the predictive model needs
         """
        
        model = StaticModel(
            mass_rider = athlete_parameters["rider_mass"],
            mass_bike = athlete_parameters["bike_mass"],
            mass_other = athlete_parameters["other_mass"],
            crr = mechanical_parameters["crr"],
            mechanical_efficiency = mechanical_parameters["mechanical_efficiency"],
            mol_whl_front = mechanical_parameters["mol_whl_front"],
            mol_whl_rear = mechanical_parameters["mol_whl_rear"],
            wheel_radius = mechanical_parameters["wheel_radius"],

            cp = athlete_parameters["CP_FTP"], #Called FTP in the athlete paratmers (double up)
            w_prime = athlete_parameters["W_prime"], #(double up)

            #This is either 1 2 or 3 depending on..
            #Default is 1
            #Number determines which function will be used to calculate energy level
            #Will need to be added to frontend
            w_prime_recovery_function = 1,

            #These two determine how much power is being used for either up, down or steady
            #Use default value in spreadsheet
            below_steady_state_max_slope = -0.01,
            below_steady_state_power_usage = 0.02,
            over_threshold_min_slope = 0.075,
            over_threshold_power_usage = 1.1,
            steady_state_power_usage = 0.91,


            climbing_cda_increment = 0.04,
            climbing_min_slope = course.min_slope_threshold,
            descending_cda_increment = -0.005,
            descending_max_slope = course.max_slope_threshold,

            wind_direction = environment_parameters["wind_direction"],
            wind_speed_mps = environment_parameters["wind_speed_mps"],
            wind_density = environment_parameters["wind_density"],

            timestep_size = 0.5,
            starting_distance = 0.1,
            starting_speed = 0.3,
        )
    
        dynamic_mod = course.gps_geo_json

        # caleb temp fix stuff
        new_agg_dist = []
        dist_total = 0
        for d in dynamic_mod.distance:
            dist_total += d
            new_agg_dist.append(dist_total)
        dynamic_mod.distance = new_agg_dist
        # /end fix stuff

        prediction_input = CourseModel(
            static_model = model,
            dynamic_model = dynamic_mod,
        )
        #Call predictive model
        output = predict_entire_course(prediction_input)


        #Translates objects into JSON
        segments_data_obj = output.segments_data[0]
        full_course_data_obj = output.full_course_data
        timesteps_data_obj = output.timesteps_data
        
        segment_list = list(None for _ in range(len(segments_data_obj.keys())))
        for i, segment_obj in segments_data_obj.items():
            segment = {
                    'average_yaw' : segment_obj.average_yaw , 
                    'average_yaw_above_40kmh' : segment_obj.average_yaw_above_40kmh , 
                    'distance' : segment_obj.distance , 
                    'duration' : segment_obj.duration ,  
                    'min_w_prime_balance' : segment_obj.min_w_prime_balance , 
                    'power_in' : segment_obj.power_in,
                    'timesteps': segment_obj.timesteps
            }
            segment_list[int(i)] = segment


        full_course_data = {
                'average_yaw' : full_course_data_obj[0].average_yaw , 
                'average_yaw_above_40kmh' : full_course_data_obj[0].average_yaw_above_40kmh , 
                'distance' : full_course_data_obj[0].distance , 
                'duration' : full_course_data_obj[0].duration ,  
                'min_w_prime_balance' : full_course_data_obj[0].min_w_prime_balance , 
                'power_in' : full_course_data_obj[0].power_in
        }
        time_steps_data = {
                'distance' : timesteps_data_obj.distance , 
                'power_in' : timesteps_data_obj.power_in , 
                'speed' : timesteps_data_obj.speed, 
                'yaw' : timesteps_data_obj.yaw , 
                'elevation' : timesteps_data_obj.elevation, 
                'w_prim_balance' : timesteps_data_obj.w_prime_balance
        }

        result = {'full_course_data': full_course_data, 'segments': segment_list, 'time_steps_data' : time_steps_data}

        return JsonResponse({'detail': 'Prediction complete', 'result' : result}, status=200)






    
