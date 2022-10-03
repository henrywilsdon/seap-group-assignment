from django.db import models

# Create your models here.
class Athlete(models.Model):
    name = models.CharField(max_length=30)
    bike_mass = models.FloatField()
    rider_other = models.FloatField(null=True)
    total_mass = models.FloatField()
    CP_FTP = models.FloatField()
    W_prime = models.FloatField()