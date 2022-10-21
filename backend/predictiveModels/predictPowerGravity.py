from temporaryModels import *

def predict_power_gravity(course: CourseModel, distance: float, speed: float, index: int) -> float:
    cs = course.static # for brevity
    cd = course.dynamic

    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other + cs.delta_kg
    cd.slope_from_prev[0] = 0
    slope = cd.slope_from_prev[index]
    power_gravity = slope * 9.81 * mass_total * speed


    return power_gravity



