from temporaryModels import *

def predict_power_in(course: CourseModel, distance: float, speed: float, acceleration: float) -> float:
    
    index = 0
    for checkedIndex in reversed(range(len(course.dynamic.distance))):
        if course.dynamic.distance[checkedIndex] <= distance:
            index = checkedIndex
        break
    course.dynamic.slope_from_prev[0] = 0
    slope = course.dynamic.slope_from_prev[index]

    if(slope < course.static.below_steady_state_max_slope):
        v_lookup = course.static.cp*0.02
    
    elif(slope >  course.static.over_threshold_min_slope):
         v_lookup = course.static.cp*0.91
    else:
         v_lookup = course.static.cp*1.1

    power_in = course.static.mechanical_efficiency * v_lookup + course.static.delta_watts
    
    return power_in