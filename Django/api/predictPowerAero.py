from api.models import *
import math

def predict_power_aero(course: CourseModel, distance: float, speed: float, index: int) -> dict:

    cs = course.static_model
    cd = course.dynamic_model

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
    v_mpsec = roughness_to_vmpsecs[cd.roughness[index]]

    wind_speed_1m = v_mpsec

    headwind_bearing_deg = cs.wind_direction - 180
    cd.bearing[0] = 0 # baked into the sheet, since the blank at 'Course info'!$H$3 is counted as 0 by vlookup (likely a bug)
    relative_wind_angle_deg = cd.bearing[index] - headwind_bearing_deg

    headwind = wind_speed_1m * math.cos(math.radians(relative_wind_angle_deg))
    sidewind = wind_speed_1m * math.sin(math.radians(relative_wind_angle_deg))
    relative_wind_speed = math.sqrt((speed + headwind)**2 + sidewind**2)



    # ---------------------------------------------------------------
    # THE PART THAT FIGURES OUT THE CDA

    # I know that "vlookup_thingy_a" and "vlookup_thingy_b" are terrible, completely unclear names for variables, but that's only because the spreadsheet is also terrible and completely unclear. I legitimately don't know what these variables represent - I'm just copying the behaviour of the spreadsheet.

    # at 'Input-Output'!$B$20:$P$22, for position 'a' specifically (the others are calculated later in this code)
    vlookup_thingy_a_table = [0.188, 0.188, 0.188, 0.186, 0.184, 0.183, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182, 0.182]

    vlookup_thingy_a_col = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12, 12][math.floor(relative_wind_speed)] - 2
    # vlookup_thingy_a_col (the value that chooses the col in vlookup_thingy_a_table) is also ITSELF calculated via a vlookup, of a static unlabelled table with no dependencies at 'Calcs'!$AE$2:$AF$82. The above line emulates THAT vlookup.
    # the -2 is because (a) the python code doesn't include the a/b/c column and (b) Python is 0-indexed and vlookup is 1-indexed

    vlookup_thingy_a = vlookup_thingy_a_table[vlookup_thingy_a_col]

    slope = cd.slope[index]
    if index == 0 or slope > cs.climbing_min_slope: # index 0 being position b is baked into the spreadsheet at 'Course info'!$M$3
        # (calculates position b)
        vlookup_thingy_a += course.static_model.climbing_cda_increment
    elif slope < cs.descending_max_slope:
        # (calculates position c)
        vlookup_thingy_a += course.static_model.descending_cda_increment
    # else position is a, and the result isn't affected

    vlookup_thingy_b_table = [0.0, -0.000400000000000011, -0.000800000000000023, -0.00120000000000003, -0.00160000000000005, -0.00200000000000006, -0.00440000000000007, -0.00680000000000008, -0.0092000000000001, -0.0116000000000001, -0.014, -0.0144, -0.0148, -0.0152, -0.0156000000000001, -0.0160000000000001, -0.0164000000000001, -0.0168000000000001, -0.0172000000000001, -0.0176000000000001, -0.0180000000000001, -0.0184000000000001, -0.0188000000000001, -0.0192000000000002, -0.0196000000000002, -0.0200000000000002, -0.0204000000000002, -0.0208000000000002, -0.0212000000000002, -0.0216000000000002, -0.0220000000000002, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003, -0.0224000000000003]
    # The table at 'Yaw response'!$I$66:$I$126 (the table is calculated based on unchanging values in the same sheet, so in the code I've just baked it in)
    # The precision is necessary so that we can prove to the company that our code matches the spreadsheet

    effective_yaw_angle = math.degrees(math.atan(
        wind_speed_1m * math.sin(math.radians(relative_wind_angle_deg))
        / (speed + wind_speed_1m * math.cos(math.radians(relative_wind_angle_deg)))
    ))

    vlookup_thingy_b = vlookup_thingy_b_table[math.floor(math.fabs(effective_yaw_angle))]

    cda = cs.delta_cda + vlookup_thingy_a + vlookup_thingy_b



    # ---------------------------------------------------------------
    # FINAL CALCULATIONS

    power_aero = 0.5 * cs.wind_density * relative_wind_speed**3 * cda
    return {"power_aero": power_aero, "yaw": effective_yaw_angle}
