from temporaryModels import *

def predict_power_gravity(course: CourseModel, distance: float, speed: float) -> float:
    index = 0
    for checkedIndex in reversed(range(len(course.dynamic.distance))):
        if course.dynamic.distance[checkedIndex] <= distance:
            index = checkedIndex
        break

    cs = course.static # for brevity
    cd = course.dynamic

    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other + cs.delta_kg
    cd.slope_from_prev[0] = 0
    slope = cd.slope_from_prev[index]
    Power_gravity = slope * 9.81 * mass_total * speed


    return Power_gravity



