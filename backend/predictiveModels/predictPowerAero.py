from temporaryModels import *
import math

def predict_power_aero(course: CourseModel, distance: float, speed: float) -> float:

    cs = course.static
    cd = course.dynamic

    index = None
    for checkedIndex in reversed(range(len(cd.distance))):
        if cd.distance[checkedIndex] <= distance:
            index = checkedIndex
            break



    # ---------------------------------------------------------------
    # THE PART THAT FIGURES OUT THE RELATIVE WIND SPEED

    # builds the 'factor lookup' table over at 'Course info'!$Q$10:$T$17
    # so that it can get vlookup'ed
    # This paragraph of code is extremely messy and inefficient, but I'm just trying to accurately emulate what the spreadsheet is doing
    # At some point, we should find some way to cache everything but the final line, because all of that is unchanging but is being recalculated for every timestep
    factor_lookup_table = [ # [roughness class, z0 length, v/msec]
                           [2.0, 0.1, None],
                           [2.5, 0.2, None],
                           [3.0, 0.4, None],
                           [3.5, 0.8, None]]
    roughness_to_vmpsecs = {}
    for row_index in range(len(factor_lookup_table)):
        # populates the v/msec column, so it's no longer None
        z0 = factor_lookup_table[row_index][1]
        factor_lookup_table[row_index][2] = cs.wind_speed_mps * math.log(1/z0) / math.log(10/z0)
        # converts it to a {roughness class: v/msec} dictionary, for ease of lookup
        roughness_to_vmpsecs[factor_lookup_table[row_index][0]] = factor_lookup_table[row_index][2]
    # looks up the current roughness in that dictionary
    v_mpsec = roughness_to_vmpsecs[cd.roughness_class[index]]

    wind_speed_1m = v_mpsec

    headwind_bearing_deg = cs.wind_direction - 180
    cd.bearing_from_prev[0] = 0 # baked into the sheet, since the blank at 'Course info'!$H$3 is counted as 0 by vlookup (likely a bug)
    relative_wind_angle_deg = cd.bearing_from_prev[index] - headwind_bearing_deg

    headwind = wind_speed_1m * math.cos(math.radians(relative_wind_angle_deg))
    sidewind = wind_speed_1m * math.sin(math.radians(relative_wind_angle_deg))
    relative_wind_speed = math.sqrt((speed + headwind)**2 + sidewind**2)



    # ---------------------------------------------------------------
    # THE PART THAT FIGURES OUT THE CDA

    # I know that "vlookup_thingy_a" and "vlookup_thingy_b" are terrible, completely unclear names for variables, but that's only because the spreadsheet is also terrible and completely unclear. I legitimately don't know what these variables represent - I'm just copying the behaviour of the spreadsheet.

    vlookup_thingy_a_table = { # at 'Input-Output'!$B$20:$P$22
        "a": [0.188, 0.188, 0.188, 0.186, 0.184, 0.183, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182],
        "b": [0.228, 0.228, 0.228, 0.226, 0.224, 0.223, 0.222, 0.222, 0.222, 0.222, 0.222, 0.222, 0.222, 0.222],
        "c": [0.193, 0.193, 0.193, 0.191, 0.189, 0.188, 0.187, 0.187, 0.187, 0.187, 0.187, 0.187, 0.187, 0.187]
    }
    slope = cd.slope_from_prev[index]
    if index == 0:
        position = "b" # this is baked into the spreadsheet at 'Course info'!$M$3
    elif slope > cs.over_threshold_min_slope:
        position = "b"
    elif slope < cs.below_steady_state_max_slope:
        position = "c"
    else:
        position = "a" # position is the row that will be used in the vlookup
        # the spreadsheet has a bug at 'Course info'!$M:$M where if the value is EXACTLY equal to the min/max, it causes an error - we're not going to emulate that bug

    vlookup_thingy_a_col = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12][math.floor(relative_wind_speed)] -2
    # vlookup_thingy_a_col (the value that chooses the col in vlookup_thingy_a_table) is also ITSELF calculated via a vlookup, of a static unlabelled table with no dependencies at 'Calcs'!$AE$2:$AF$82. The above line emulates THAT vlookup.
    # the -2 is because (a) the python code doesn't include the a/b/c column and (b) Python is 0-indexed and vlookup is 1-indexed

    vlookup_thingy_a = vlookup_thingy_a_table[position][vlookup_thingy_a_col]

    vlookup_thingy_b_table = [0.000, 0.000, -0.001, -0.001, -0.002, -0.002, -0.004, -0.007, -0.009, -0.012, -0.014, -0.014, -0.015, -0.015, -0.016, -0.016, -0.016, -0.017, -0.017, -0.018, -0.018, -0.018, -0.019, -0.019, -0.020, -0.020, -0.020, -0.021, -0.021, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022, -0.022] # The table at 'Yaw response'!$I$66:$I$126 (the table is calculated based on unchanging values in the same sheet, so in the code I've just baked it in)

    effective_yaw_angle = math.degrees(math.atan(
        wind_speed_1m * math.sin(math.radians(relative_wind_angle_deg))
        / (speed + wind_speed_1m * math.cos(math.radians(relative_wind_angle_deg)))
    ))

    vlookup_thingy_b = vlookup_thingy_b_table[math.floor(math.fabs(effective_yaw_angle))]

    cda = cs.delta_cda + vlookup_thingy_a + vlookup_thingy_b



    # ---------------------------------------------------------------
    # FINAL CALCULATIONS

    power_aero = 0.5 * cs.wind_density * relative_wind_speed**3 * cda
    return power_aero
