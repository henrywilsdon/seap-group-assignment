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

class BikePlusRiderModel(models.Model):
    mass_rider = models.FloatField()
    mass_bike = models.FloatField()
    mass_other = models.FloatField()
    crr = models.FloatField()
    mechanical_efficiency = models.FloatField()
    mol_whl_front = models.FloatField()
    mol_whl_rear = models.FloatField()
    wheel_radius = models.FloatField()

class CPModel(models.Model):
    cp = models.FloatField()
    w_prime = models.FloatField()
    w_prime_recovery_function = models.FloatField()
    below_steady_state_max_slope = models.FloatField()
    below_steady_state_power_usage = models.FloatField()
    over_threshold_min_slope = models.FloatField()
    over_threshold_power_usage = models.FloatField()
    steady_state_power_usage = models.FloatField()

class PositionModel(models.Model):
    climbing_cda_increment = models.FloatField()
    climbing_min_slope = models.FloatField()
    descending_cda_increment = models.FloatField()
    descending_max_slope = models.FloatField()

class EnvironmentModel(models.Model):
    wind_direction = models.FloatField()
    wind_speed_mps = models.FloatField()
    wind_density = models.FloatField()

class TechnicalModel(models.Model):
    timestep_size = models.FloatField()
    starting_distance = models.FloatField()
    starting_speed = models.FloatField()

class StaticModel(models.Model):
    bike_plus_rider_model = models.OneToOneField("BikePlusRiderModel", on_delete=models.CASCADE)
    cp_model = models.OneToOneField("CPModel", on_delete=models.CASCADE)
    position_model = models.OneToOneField("PositionModel", on_delete=models.CASCADE)
    environment_model = models.OneToOneField("EnvironmentModel", on_delete=models.CASCADE)
    technical_model = models.OneToOneField("TechnicalModel", on_delete=models.CASCADE)



class DynamicModel(models.Model):
    lat = ArrayField(models.FloatField())
    long = ArrayField(models.FloatField())
    ele = ArrayField(models.FloatField())
    distance = ArrayField(models.FloatField())
    bearing = ArrayField(models.FloatField())
    slope = ArrayField(models.FloatField())



"""
course = {
    "static": { # inputs that are the same for the entire course
        "bike plus rider": {"mass rider": 71, "mass bike": 7, "mass other": 1, "crr": 0.0025, "mechanical efficiency": 0.98, "mol whl front": 0.08, "mol whl rear": 0.08, "wheel radius": 0.335},
        "cp_model": {"cp": 430, "w'": 35000, "w' recovery function": 1, "below steady state max slope": -0.01, "below steady state power usage": 0.02, "over threshold min slope": 0.075, "over threshold power usage": 1.1, "steady state power usage": 0.91},
        "position": {"climbing CDA increment": 0.04, "climbing min slope": 0.3, "descending CDA increment": -0.005, "descending max slope": -0.01},
        "environment": {"wind direction": 30, "wind speed m/s": 2, "density": 1.13},
        "technical": {"timestep size": 0.5, "starting distance": 0.1, "starting speed": 0.3}
    }, 
    "dynamic": { # inputs that change throughout the course
        "lat": [35.37245, 35.37262, 35.37277, 35.37292, 35.37307, 35.37323, 35.37338, 35.37353, 35.37368, 35.37384, 35.37399, 35.37414, 35.37429, 35.37445, 35.37461, 35.37477, 35.37493, 35.37508, 35.37525, 35.37541, 35.37558, 35.37574, 35.37591, 35.37608, 35.37625, 35.37641, 35.37657, 35.3767, 35.37672, 35.37662, 35.37657, 35.37659, 35.37673, 35.3769],
        "lon": [138.92742, 138.9279, 138.92813, 138.92838, 138.92862, 138.92886, 138.9291, 138.92935, 138.92959, 138.92981, 138.93004, 138.93027, 138.93049, 138.9307, 138.93092, 138.93114, 138.93136, 138.9316, 138.93183, 138.93205, 138.93228, 138.93251, 138.93275, 138.93298, 138.93323, 138.93346, 138.93366, 138.93384, 138.93401, 138.93414, 138.93432, 138.93452, 138.93464, 138.93471],
        "ele": [593, 593.1, 593.3, 593, 592.3, 591.7, 591.7, 591.5, 591.3, 591.3, 591.3, 591.3, 591, 591.5, 591.6, 591.8, 591.8, 591.6, 591.5, 591.5, 591.3, 591, 591.2, 591, 590.4, 589.9, 589.4, 589.2, 588.6, 588.1, 588, 588.4, 589.2, 590.1],
        "distance": [None, 47.4, 74.2, 102.3, 129.7, 157.8, 185.2, 213.4, 240.8, 267.5, 294.2, 320.9, 346.9, 373, 399.7, 426.4, 453.2, 480.6, 508.7, 535.5, 563.6, 591, 619.8, 648, 677.5, 704.9, 730.3, 752.1, 767.7, 783.9, 801.1, 819.4, 838.4, 858.3],
        # in the sheet, bearing and slope are calculated values
        # but I think it'd be more convenient to put them in gpx_to_json()
        # so you don't have to recompute them each time
        "bearing from prev": [None, 73.89, 62.00, 63.93, 63.00, 61.47, 63.00, 63.93, 63.00, 59.33, 62.00, 62.00, 60.93, 58.15, 59.33, 59.33, 59.33, 63.00, 58.92, 59.33, 58.92, 60.44, 59.99, 58.92, 60.99, 60.44, 56.88, 59.51, 84.52, 122.1, 102.7, 85.34, 46.43, 26.79],
        "slope from prev": [None, 0.002, 0.007, -0.011, -0.026, -0.021, 0.000, -0.007, -0.007, 0.000, 0.000, 0.000, -0.012, 0.019, 0.004, 0.007, 0.000, -0.007, -0.004, 0.000, -0.007, -0.011, 0.007, -0.007, -0.020, -0.018, -0.020, -0.009, -0.038, -0.031, -0.006, 0.022, 0.042, 0.045]
    }
} # The data is being stored as {data type: [all timesteps]}, just because it makes it easier to write the above code
"""
