from django.contrib.postgres.fields import ArrayField
from django.db import models



class Athlete(models.Model):
    name = models.CharField(max_length=30)
    bike_mass = models.FloatField()
    rider_mass = models.FloatField(null=True)
    other_mass = models.FloatField(null=True)
    total_mass = models.FloatField()
    CP_FTP = models.FloatField()
    W_prime = models.FloatField()

class Course(models.Model):
    name = models.CharField(max_length=30)
    location = models.CharField(max_length=30)
    last_updated = models.DateTimeField()
    gps_geo_json = models.OneToOneField("DynamicModel", on_delete=models.CASCADE)
    min_slope_threshold = models.FloatField(blank=True, default = 0)
    max_slope_threshold = models.FloatField(blank=True, default = 0)

class StaticModel(models.Model):

    # the bike and its rider
    mass_rider = models.FloatField()
    mass_bike = models.FloatField()
    mass_other = models.FloatField()
    delta_kg = models.FloatField(default = 0)
    crr = models.FloatField()
    mechanical_efficiency = models.FloatField()
    mol_whl_front = models.FloatField()
    mol_whl_rear = models.FloatField()
    wheel_radius = models.FloatField()

    # the cp model
    cp = models.FloatField()
    w_prime = models.FloatField()
    w_prime_recovery_function = models.FloatField()
    below_steady_state_max_slope = models.FloatField()
    below_steady_state_power_usage = models.FloatField()
    over_threshold_min_slope = models.FloatField()
    over_threshold_power_usage = models.FloatField()
    steady_state_power_usage = models.FloatField()

    # the position (pose/stance) of the rider
    climbing_cda_increment = models.FloatField()
    climbing_min_slope = models.FloatField()
    descending_cda_increment = models.FloatField()
    descending_max_slope = models.FloatField()

    # the environment
    wind_direction = models.FloatField()
    wind_speed_mps = models.FloatField()
    wind_density = models.FloatField()

    # technical details needed for the predictive model
    timestep_size = models.FloatField()
    starting_distance = models.FloatField()
    starting_speed = models.FloatField()

    # uncategorised, but definitely used
    delta_cda = models.FloatField(default=0)
    delta_watts = models.FloatField(default=-20)

class DynamicModel(models.Model):
    owner = models.CharField(max_length=30, blank=True)
    lat = ArrayField(models.FloatField(), blank=True)
    long = ArrayField(models.FloatField(), blank=True)
    ele = ArrayField(models.FloatField(), blank=True)
    distance = ArrayField(models.FloatField(), blank=True)
    bearing = ArrayField(models.FloatField(), blank=True)
    slope = ArrayField(models.FloatField(), blank=True)

class CourseModel(models.Model):
    static_model = models.OneToOneField("StaticModel", on_delete=models.CASCADE)
    dynamic_model = models.OneToOneField("DynamicModel", on_delete=models.CASCADE)

