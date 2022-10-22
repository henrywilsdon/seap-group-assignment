from temporaryModels import *

def predict_power_roll(course: CourseModel, speed: float) -> float:

    cs = course.static_model # for brevity

    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other + cs.delta_kg
    power_roll = mass_total * cs.crr * 9.81 * speed

    return power_roll