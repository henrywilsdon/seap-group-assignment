from django.contrib import admin

from .models import Athlete
from .models import *

# Register your models here.
@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ['name','bike_mass','rider_other','total_mass','CP_FTP','W_prime']

@admin.register(BikePlusRiderModel)
class BikePlusRiderModelAdmin(admin.ModelAdmin):
    list_display = ['mass_rider', 'mass_bike', 'mass_other', 'crr', 'mechanical_efficiency', 'mol_whl_front', 'mol_whl_rear', 'wheel_radius']