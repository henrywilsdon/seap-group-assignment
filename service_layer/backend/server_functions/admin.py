from django.contrib import admin

from .models import Athlete

# Register your models here.
@admin.register(Athlete)
class AthleteAdmin(admin.ModelAdmin):
    list_display = ['name','bike_mass','rider_mass','other_mass','total_mass','CP_FTP','W_prime']
