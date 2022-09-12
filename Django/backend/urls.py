"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    #path('api/<int:user_id>/', views.user_detail, name='user_detail'),
    path('api/register/', views.register_view, name='register'),
    path('api/login/', views.login_view, name='login'),
    path('api/logout/', views.logout_view, name='logout'),
    path('api/user/me/', views.user_view, name='update_user'),
    path('api/user/me/password/',
         views.user_password_view, name='update_user_password'),
    path('api/athlete/', views.all_athletes_view, name='athlete'),
    path('api/athlete/<int:athlete_id>',
         views.athlete_view, name='athlete'),
    #path('api/user/get/', views.get_user_view, name='get_user'),
    #path('api/user/me/dummy', views.current_user,name='current_user'),
    #path('api/csrf', views.csrf,name='csrf'),
    #path('api/login', views.empty_login,name='login'),
]
