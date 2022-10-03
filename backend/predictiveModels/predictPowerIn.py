from temporaryModels import *

def predict_power_in(course: CourseModel, distance: float) -> float:

    cs = course.static
    cd = course.dynamic

    index = 0
    for checkedIndex in reversed(range(len(cd.distance))):
        if cd.distance[checkedIndex] <= distance:
            index = checkedIndex
        break
    cd.slope_from_prev[0] = 0
    slope = cd.slope_from_prev[index]

    if(slope < cs.below_steady_state_max_slope):
        v_lookup = cs.cp * cs.below_steady_state_power_usage
    elif(slope >  cs.over_threshold_min_slope):
         v_lookup = cs.cp * cs.over_threshold_power_usage
    else:
         v_lookup = cs.cp * cs.steady_state_power_usage

    power_in = cs.mechanical_efficiency * v_lookup + cs.delta_watts
    
    return power_in