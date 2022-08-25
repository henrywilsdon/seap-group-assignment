from contextlib import redirect_stderr
import json
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth import authenticate
from django.contrib.auth.forms import UserCreationForm

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

def current_user(request):
    return HttpResponse('username')

def empty_login(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        username = data["username"]
        password = data["password"]
        return HttpResponse('sessionId')
    return HttpResponse('Resquest invalid, not a POST')

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