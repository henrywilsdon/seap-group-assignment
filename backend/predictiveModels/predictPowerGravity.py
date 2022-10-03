from temporaryModels import *

def predict_power_gravity(course: CourseModel, distance: float, speed: float) -> float:
    # TODO: this function
    # some arguments may not be necessary - once the code has been finished, we can get rid of whatever arguments we don't need

    index = 0
    for checkedIndex in reversed(range(len(course.dynamic.distance))):
        if course.dynamic.distance[checkedIndex] <= distance:
            index = checkedIndex
        break

    mass_total = course.static.mass_rider + course.static.mass_bike + course.static.mass_other + course.static.delta_kg
    course.dynamic.slope_from_prev[0] = 0
    slope = course.dynamic.slope_from_prev[index]
    Power_gravity = slope * 9.81 * mass_total * speed


    return Power_gravity



