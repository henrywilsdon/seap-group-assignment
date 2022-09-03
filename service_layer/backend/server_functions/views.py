import json
from contextlib import redirect_stderr
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User
from django.http import HttpResponse, JsonResponse
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
    username = user_data["username"]
    email = user_data["email"]
    password = user_data["password"]

    if username is None or email is None:
        user = User.objects.create_user(username, email, password)
        if "first_name" in user_data:
            first_name = user_data["first_name"]
            user.first_name = first_name
            return JsonResponse({'detail': 'Successfully registered.'})
    else:
        return JsonResponse({'detail': 'Username or email already in use'}, status=400)


@require_POST
def login_view(request):
    data = json.loads(request.body)
    username = data["username"]
    password = data["password"]

    if username is None or password is None:
        return JsonResponse({'detail': 'Please provide username and password.'}, status=400)

    # return HttpResponse('sessionId')
    user = authenticate(request, username=username, password=password)
    if user is not None:
        login(request, user)
        return JsonResponse({
            'detail': 'Successfully logged in.',
            'sessionId': request.session.session_key
        })
    else:
        return JsonResponse({'detail': 'Invalid credentials.'}, status=400)


def logout_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({'detail': 'You\'re not logged in.'}, status=400)
    logout(request)
    return JsonResponse({'detail': 'Successfully logged out.'})


@require_GET
def current_user(request):
    if request.user.is_authenticated:
        return JsonResponse({'username': 'test'})
    return JsonResponse({'detail': 'You\'re not logged in.'}, status=401)


def user_detail(request, user_id):
    return HttpResponse(f'<p>user_detail view with id {user_id}</p>')
    # JSON


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


""" def registerPage(request):
    form = UserCreationForm()
    context = {'form':form}
    return render(request, 'register.html', context)

def csrf(request):
    return HttpResponse('check out this cookie') """

# function for ensuring token
