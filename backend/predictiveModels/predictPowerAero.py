from temporaryModels import *
import math

def predict_power_aero(course: CourseModel, distance: float, speed: float, acceleration: float) -> float:
    # TODO: this function
    # some arguments may not be necessary - once the code has been finished, we can get rid of whatever arguments we don't need

    index = None
    for checkedIndex in reversed(range(len(course.dynamic.distance))):
        if course.dynamic.distance[checkedIndex] <= distance:
            index = checkedIndex
            break

    # ---------------------------------------------------------------
    # THE PART THAT FIGURES OUT THE RELATIVE WIND SPEED

    # builds the 'factor lookup' table over at 'Course info'!$Q$10:$T$17
    # so that it can get vlookup'ed
    # This code is extremely messy and inefficient, but I'm just trying to accurately emulate what the spreadsheet is doing
    # At some point, we should find some way to cache everything but the final line, because all of that is unchanging but is being recalculated for every timestep
    factor_lookup_table = [ # [roughness class, z0 length, v/msec]
                           [2.0, 0.1, None],
                           [2.5, 0.2, None],
                           [3.0, 0.4, None],
                           [3.5, 0.8, None]]
    roughness_to_vmpsecs = {}
    for row_index in range(len(factor_lookup_table)):
        z0 = factor_lookup_table[row_index][1]
        factor_lookup_table[row_index][2] = course.static.wind_speed_mps * math.log(1/z0) / math.log(10/z0)
        roughness_to_vmpsecs[factor_lookup_table[row_index][0]] = factor_lookup_table[row_index][2]
    v_mpsec = roughness_to_vmpsecs[course.dynamic.roughness_class[index]]

    estimated_wind_speed = course.static.wind_speed_mps * math.log(1 / v_mpsec) / math.log(10 / v_mpsec) # estimated_wind_speed is the same as wind_speed_1m

    headwind_bearing_deg = course.static.wind_direction - 180
    course.dynamic.bearing_from_prev[0] = 0 # baked into the sheet, since the blank at 'Course info'!$H$3 is counted as 0 by vlookup (likely a bug, but a bug we need to emulate)
    relative_wind_angle_deg = course.dynamic.bearing_from_prev[index] - headwind_bearing_deg

    headwind = estimated_wind_speed*math.cos(math.radians(relative_wind_angle_deg))
    sidewind = estimated_wind_speed*math.sin(math.radians(relative_wind_angle_deg))
    relative_wind_speed = math.sqrt((speed + headwind)**2 + sidewind**2)

    # ---------------------------------------------------------------
    # THE PART THAT FIGURES OUT THE CDA

    cda = 1

    # ---------------------------------------------------------------
    # FINAL CALCULATIONS

    power_aero = 0.5 * course.static.wind_density * relative_wind_speed**3 * cda
    return power_aero
