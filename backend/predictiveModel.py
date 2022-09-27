
"""
powerAero = 0.5 * Density * relative wind speed^3 * CDA
    Density = named term meaning wind density, same for all course
    
    relative wind speed = the actual absolute relative windspeed. In other words, regardless of whether the wind is blowing you back, forwards or sideways, it's all counted the same - this number is always positive. It's the speed that the wind is blowing onto you, regardless of what direction that wind is coming from. Calculated via pythag of sqrt((your speed + headwind)^2 + sidewind^2)
     
       headwind, sidewind = calculated via trig of wind angle and a windspeed estimate
       
           wind angle = calculated via bearing and a fixed wind direction that's the same for the entire course
           
           estimated wind speed ("windspeed at 1m") = wind speed in m/s * ln(1 / z0 length based on roughness class for point) / ln(10 / z0 length based on roughness class for point)
           
               wind speed in m/s = fixed wind speed that's same for entire course
               
               z0 length = length based on roughness class for point (in a lookup table)
       
       your speed = [[PREV]] speed + ( [[PREV]] accel in /s * timestep in s
           
           [[PREV]] speed = same as above, assume start of 0.3
           
           [[PREV]] acceleration 
      
    CDA = delta_CDA + vlookup thingy A + vlookup thingy B (function that outputs useful data for wind drag)
    
        delta_CDA = input that's same for entire course, by default 0
        
        vlookup thingy A = table, row, col
            
            table = static thing with no dependencies at 'Input-Output'!$B$20:$P$22 that I don't understand
            
            row = position (sitting position)
                
                Position = a/b/c (seated aero / on outriggers (training wheels) / supertuck). Different per point. Calculated based on piecewise a<b<c slope (diff per point) and slope threshold [above/below] which person goes into [position] (same for entire race).
                
                    Slope = standard rise/run percent, where 0% is flat, 100% is 45deg up, etc. Average of (prev to curr) and (curr to next).
                    
                    Slope threshold = same for entire race, as mentioned above  
                    
            col = vlookup of relative wind speed (see above) in a static unlabelled table with no dependencies at 'Calcs'$AE$2:$AF$82
        
        vlookup thingy B = table, row, col. Col is set to 3 always.
            
            row = abs(effective_yaw_angle)
                effective_yaw_angle = a complicated trig equation with the following inputs:
                    wind speed estimate (see above)
                    wind angle (see above)
                    Speed (see above)
            
            table = converts yaw angles to "delta from 0 deg" (which is in 3rd column). Table at 'Yaw response'!$G$6:$I$126. The table has no dependencies in other sheets. Input is treated as absolute. See the little table in the top left? Imagine "yaw" and "delta CDA / degree" are a piecewise function (i.e. if the input is 5, the output is 0.0004). Then, take the integral of that, then subtract a constant so that 0 in = 0 out. Also, make all inputs positive before passing them into the function, and make all outputs negative right before returning them. That's the function for "yaw" -> "delta from 0 deg" in the big table. That's what the other thing is doing a vlookup of.
                
Power_roll = Mass_total * Crr * 9.81 * Speed
    
    Mass_total = an input value that's the same for the entire course (mass of rider + mass of bike + mass of "other"), at 'Input-Output'!$B$6
    
    Crr = an input value that's the same for the entire course, at 'Input-Output'!$B$12. Coefficient for "tyre rolling resistance properties".
    
    Speed = defined above (different per point)

Power_gravity = Slope * 9.81 * Mass_total * Speed

    Slope = standard rise/run percent, defined above (different per point)
    
    Mass_total = defined above (input that's same for entire course)
    
    Speed = defined above (different per point)

Power_in = Mech_eff * vlookup thingy C + delta_Watts

    Mech_eff = mechanical efficiency, input value that's same for entire course at 'Input-Output'!$B$6, next to "crr" (see above)
    
    vlookup thingy C = converts the input (slope) to the output (power) based on a piecewise function. The table is at 'Input-Output'!$A$37:$C$42, which copies its values from 'Input-Output'!$B$31:$B$33. The slope determines whether you're descending/flattish/ascending, which determines how much power you're using (as a percentage of Critical Power aka CP aka FTP). Critical Power is an input, but the rest of the numbers (e.g. % of CP per slope) aren't.
    
    delta_Watts = an input value that's the same for the entire race, and doesn't have any explanation other than its name
    
Power_net = Power_in - Power_aero - Power_roll - Power_gravity

Propulsive_force = Power_net / Speed

Accel = Propulsive_force / (Mass_total+(MoI_whl_front/Wheel_radius^2)+(MoI_whl_rear/Wheel_radius^2))

    Everything other than Propulsive_force is an initial input that's the same for the entire track, and that isn't further explained other than those names.
    
(Accel determines the next speed, as stated above)


The amount of energy left in your bucket doesn't actually form part of your speed calculations - they calculate the speed separately, and then a separate bit of code makes sure the "amount left" (W') doesn't become negative at any point.
Amount left in the bucket is in the column Calcs!AA
"""


from temporaryModels import *
import math

def predict_power_aero(course: CourseModel) -> float:
    # TODO: this function
    # can modify the arguments to add whatever is necessary
    return 1

def predict_power_roll(course: CourseModel) -> float:
    # TODO: this function
    # can modify the arguments to add whatever is necessary
    return 1

def predict_power_gravity(course: CourseModel) -> float:
    # TODO: this function
    # can modify the arguments to add whatever is necessary
    return 1

def predict_power_in(course: CourseModel) -> float:
    # TODO: this function
    # can modify the arguments to add whatever is necessary
    return 1

def predict_w_prime_balance(course: CourseModel, prev_w_prime_balance, power_in) -> float:
    # TODO: this function
    # these arguments are correct
    return 1

def predict_single_timestep(course: CourseModel, # time doesn't need to be an argument here
                            w_prime_balance: float,
                            distance: float,
                            speed: float,
                            acceleration: float) \
                            -> SingleTimestepOutput:

    # for brevity
    # I think we should get rid of categories altogether (other than static and dynamic), because it's getting unweildy otherwise
    cs = course.static
    cd = course.dynamic
    cs.bpr = cs.bike_plus_rider_m
    cs.t = cs.technical_m

    speed += acceleration * cs.t.timestep_size
    distance += speed * cs.t.timestep_size
    # yes, that's correct: speed uses the PRIOR acceleration, but distance uses the CURRENT speed

    # the bulk of the 'predict' stuff (where it calls other functions)
    power_aero = predict_power_aero(course)
    power_roll = predict_power_roll(course)
    power_gravity = predict_power_gravity(course)
    power_in = predict_power_in(course)
    w_prime_balance = predict_w_prime_balance(course, w_prime_balance, power_in)

    power_net = power_in - power_aero - power_roll - power_gravity
    propulsive_force = power_net / speed
    mass_total = cs.bpr.mass_rider + cs.bpr.mass_bike + cs.bpr.mass_other
    acceleration = propulsive_force / (mass_total + ( (cs.bpr.moi_whl_front + cs.bpr.moi_whl_rear) / cs.bpr.wheel_radius**2))

    return SingleTimestepOutput(distance=distance+1, # TODO: make distance the correct value
                                speed=speed, # current speed is based on the previous speed and acceleration
                                acceleration=acceleration,
                                w_prime_balance=w_prime_balance
                                )

def predict_entire_course(course) -> PredictEntireCourseOutput:

    max_distance = course.dynamic.distance[-1] # last distance in list
    current_distance = course.static.technical_m.starting_distance
    current_speed = course.static.technical_m.starting_speed
    current_acceleration = 0
    current_time = 0
    current_w_prime_balance = course.static.cp_m.w_prime
    min_w_prime_balance = float('inf')

    while current_distance < max_distance:

        single_out = predict_single_timestep(course=course,
                                             w_prime_balance=current_w_prime_balance,
                                             distance=current_distance,
                                             speed=current_speed,
                                             acceleration=current_acceleration)

        current_distance = single_out.distance
        current_speed = single_out.speed
        current_acceleration = single_out.acceleration
        current_time += course.static.technical_m.timestep_size
        min_w_prime_balance = min(current_w_prime_balance, single_out.w_prime_balance)
        current_w_prime_balance = single_out.w_prime_balance

    return PredictEntireCourseOutput(duration=current_time, min_w_prime_balance=min_w_prime_balance)

toprint = predict_entire_course(CourseModel())
print(toprint.duration)





