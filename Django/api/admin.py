from django.contrib import admin
from .models import *



@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ['name','bike_mass','rider_other','total_mass','CP_FTP','W_prime']

@admin.register(BikePlusRiderModel)
class BikePlusRiderModelAdmin(admin.ModelAdmin):
    list_display = ['mass_rider', 'mass_bike', 'mass_other', 'crr', 'mechanical_efficiency', 'mol_whl_front', 'mol_whl_rear', 'wheel_radius']

@admin.register(CPModel)
class CPModelAdmin(admin.ModelAdmin):
    list_display = ['w_prime_recovery_function', 'below_steady_state_max_slope', 'below_steady_state_power_usage', 'over_threshold_min_slope', 'over_threshold_power_usage', 'steady_state_power_usage']

@admin.register(PositionModel)
class PositionModelAdmin(admin.ModelAdmin):
    list_display = ['climbing_cda_increment', 'climbing_min_slope', 'descending_cda_increment', 'descending_max_slope']

@admin.register(EnvironmentModel)
class EnvironmentModelAdmin(admin.ModelAdmin):
    list_display = ['wind_direction', 'wind_speed_mps', 'wind_density']

@admin.register(TechnicalModel)
class TechnicalModelAdmin(admin.ModelAdmin):
    list_display = ['timestep_size', 'starting_distance', 'starting_speed']

@admin.register(StaticModel)
class StaticModelAdmin(admin.ModelAdmin):
    list_display = ['bike_plus_rider_model', 'cp_model', 'position_model', 'environment_model', 'technical_model']

@admin.register(DynamicModel)
class DynamicModel(admin.ModelAdmin):
    list_display = ['lat', 'long', 'ele', 'distance', 'bearing', 'slope']

