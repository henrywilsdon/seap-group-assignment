from django.db import models

# Create your models here.

# athelete model
# Name
# Bike Mass
# Rider Other
# Total Mass
# Total Mass
# CP_FTP
# W_prime

class Athlete(models.Model):
    name = models.CharField(max_length=30)
    bike_mass = models.FloatField()
    rider_mass = models.FloatField(null=True)
    other_mass = models.FloatField(null=True)
    total_mass = models.FloatField()
    CP_FTP = models.FloatField()
    W_prime = models.FloatField()

