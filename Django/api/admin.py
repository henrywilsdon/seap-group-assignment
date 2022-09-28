from django.contrib import admin

from .models import *

# Register your models here.
@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ['name','bike_mass','rider_other','total_mass','CP_FTP','W_prime']

@admin.register(StaticModel)
class StaticModelAdmin(admin.ModelAdmin):
    list_display = ['mass_rider', 'mass_bike', 'mass_other', 'crr', 'mechanical_efficiency', 'mol_whl_front', 'mol_whl_rear', 'wheel_radius', 'cp', 'w_prime', 'w_prime_recovery_function', 'below_steady_state_max_slope', 'below_steady_state_power_usage', 'over_threshold_min_slope', 'over_threshold_power_usage', 'steady_state_power_usage', 'climbing_cda_increment', 'climbing_min_slope', 'descending_cda_increment', 'descending_max_slope', 'wind_direction', 'wind_speed_mps', 'wind_density', 'timestep_size', 'starting_distance', 'starting_speed']

@admin.register(DynamicModel)
class DynamicModel(admin.ModelAdmin):
    list_display = ['lat', 'long', 'ele', 'distance', 'bearing', 'slope']

@admin.register(CourseModel)
class CourseModel(admin.ModelAdmin):
    list_display = ['static_model', 'dynamic_model']