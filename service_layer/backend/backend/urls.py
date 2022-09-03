"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
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

from server_functions import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.home, name='home'),
    #path('server_functions/<int:user_id>/', views.user_detail, name='user_detail'),
    path('server_functions/register/', views.register_view, name='register'),
    path('server_functions/login', views.login_view, name='login'),
    path('server_functions/logout', views.logout_view, name='logout'),
    path('server_functions/user/me', views.current_user, name='current_user'),
    path('server_functions/athlete', views.get_all_athletes, name='athlete'),
    #path('server_functions/csrf', views.csrf,name='csrf'),
    #path('server_functions/login', views.empty_login,name='login'),
]
