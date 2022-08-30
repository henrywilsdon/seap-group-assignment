from contextlib import redirect_stderr
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth.models import User

# Create your views here.
from .forms import LoginForm

""" def login_view(request):
    form = LoginForm(request.post or None)
    if form.isvalid():
        username = form.cleaned_data.get("username")
        password = form.cleaned_data.get("password")
        user = authenticate(request, username=username,
        password=password)
        if user == None:
            attempt = request.session.get("attempt") or 0
            request.session['attempt'] = attempt + 1
            return redirect("/invlaid-password") """

def home(request):
    return HttpResponse('<p>home view</p>')

def register_view(request):
    user_data  = json.loads(request.body)
    username = user_data["username"]
    email = user_data["email"]
    password = user_data["password"]
    if "first_name" in user_data:
        first_name = user_data["first_name"]
    user = User.objects.create_user(username, email, password)
    user.first_name = first_name


""" id	integer Auto Increment [nextval('auth_user_id_seq')]	
password	character varying(128)	
last_login	timestamptz NULL	
is_superuser	boolean	
username	character varying(150)	
first_name	character varying(30)	
last_name	character varying(150)	
email	character varying(254)	
is_staff
is_active
date_joined
 """





def login_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        #return HttpResponse('sessionId')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            HttpResponse('Login Succesful')
        else:
            HttpResponse('Could not find username or password') 
    return HttpResponse('Request invalid, not a POST')

def logout_view(request):
    logout(request)
    HttpResponse('Logout Successful')

def user_detail(request, user_id):
    return HttpResponse(f'<p>user_detail view with id {user_id}</p>')
    #JSON

def registerPage(request):
    form = UserCreationForm()
    context = {'form':form}
    return render(request, 'register.html', context)

def csrf(request):
    return HttpResponse('check out this cookie')

#function for ensuring token