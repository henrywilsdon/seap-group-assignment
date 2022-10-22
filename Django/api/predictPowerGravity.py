from api.models import *

def predict_power_gravity(course: CourseModel, distance: float, speed: float, index: int) -> float:
    cs = course.static_model # for brevity
    cd = course.dynamic_model

    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other + cs.delta_kg
    cd.slope[0] = 0
    slope = cd.slope[index]
    power_gravity = slope * 9.81 * mass_total * speed


    return power_gravity



