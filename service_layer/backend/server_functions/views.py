import json
from contextlib import redirect_stderr
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
from django.views.decorators.http import require_POST, require_GET, require_http_methods
from django.middleware.csrf import get_token
from django.views.decorators.csrf import ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

# Create your views here.


def get_csrf(request):
    response = JsonResponse({'detail': 'CSRF cookie set'})
    response['X-CSRFToken'] = get_token(request)
    return response


def home(request):
    return HttpResponse('<p>home view</p>')


@require_POST
def register_view(request):
    user_data = json.loads(request.body)
    username = user_data["email"]
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
    username = data["email"]
    password = data["password"]

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide email and password.'}, status=400)

    user = authenticate(request, username=username, password=password)
    if username_exists(username):
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


@require_GET
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': 'test'})
    return JsonResponse({'detail': 'You\'re not logged in.'}, status=401)


@require_GET
def get_all_athletes(request):
    athletes = [
        {
            "id": "1",
            "fullName": "Caleb Rust",
            "riderMass": 75,
            "bikeMass": 7,
            "otherMass": 1,
            "totalMass": 83,
            "cp": 2000,
            "wPrime": 400,
        },
        {
            "id": 2,
            "fullName": "Ted Ijnkij",
            "riderMass": 78,
            "bikeMass": 3,
            "otherMass": 2,
            "totalMass": 83,
            "cp": 2030,
            "wPrime": 450,
        },
    ]
    return JsonResponse({'athletes': athletes})


@require_http_methods(["PUT"])
def update_user_view(request):
    data = json.loads(request.body)
    username = data["email"]
    currentPassword = data["currentPassword"]
    newPassword = data["newPassword"]

    user = authenticate(request, username=username, password=currentPassword)
    if user.is_authenticated:
        user.password = newPassword
        return JsonResponse({'detail': 'Successfully changed password'}, status=200)
    else:
        return JsonResponse({'detail': 'User not authenticated'}, status=400)


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
