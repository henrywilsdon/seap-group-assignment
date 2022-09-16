
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



"""



# The amount of energy left in your bucket doesn't actually form part of your speed calculations - they calculate the speed separately, and then a separate bit of code makes sure the "amount left" (W') doesn't become negative at any point.

course = {
    "static": { # inputs that are the same for the entire course
        "bike plus rider": {"mass rider": 71, "mass bike": 7, "mass other": 1, "crr": 0.0025, "mechanical efficiency": 0.98, "mol whl front": 0.08, "mol whl rear": 0.08, "wheel radius": 0.335},
        "cp_model": {"cp": 430, "w'": 35000, "w' recovery function": 1, "below steady state max slope": -0.01, "below steady state power usage": 0.02, "over threshold min slope": 0.075, "over threshold power usage": 1.1, "steady state power usage": 0.91},
        "position": {"climbing CDA increment": 0.04, "climbing min slope": 0.3, "descending CDA increment": -0.005, "descending max slope": -0.01},
        "environment": {"wind direction": 30, "wind speed m/s": 2, "density": 1.13},
        "technical": {"timestep size": 0.5, "starting distance": 0.1, "starting speed": 0.3}
    }, "dynamic": { # inputs that change throughout the course
        "lat": [35.37245, 35.37262, 35.37277, 35.37292, 35.37307, 35.37323, 35.37338, 35.37353, 35.37368, 35.37384, 35.37399, 35.37414, 35.37429, 35.37445, 35.37461, 35.37477, 35.37493, 35.37508, 35.37525, 35.37541, 35.37558, 35.37574, 35.37591, 35.37608, 35.37625, 35.37641, 35.37657, 35.3767, 35.37672, 35.37662, 35.37657, 35.37659, 35.37673, 35.3769],
        "lon": [138.92742, 138.9279, 138.92813, 138.92838, 138.92862, 138.92886, 138.9291, 138.92935, 138.92959, 138.92981, 138.93004, 138.93027, 138.93049, 138.9307, 138.93092, 138.93114, 138.93136, 138.9316, 138.93183, 138.93205, 138.93228, 138.93251, 138.93275, 138.93298, 138.93323, 138.93346, 138.93366, 138.93384, 138.93401, 138.93414, 138.93432, 138.93452, 138.93464, 138.93471],
        "ele": [593, 593.1, 593.3, 593, 592.3, 591.7, 591.7, 591.5, 591.3, 591.3, 591.3, 591.3, 591, 591.5, 591.6, 591.8, 591.8, 591.6, 591.5, 591.5, 591.3, 591, 591.2, 591, 590.4, 589.9, 589.4, 589.2, 588.6, 588.1, 588, 588.4, 589.2, 590.1],
        "distance": [None, 47.4, 74.2, 102.3, 129.7, 157.8, 185.2, 213.4, 240.8, 267.5, 294.2, 320.9, 346.9, 373, 399.7, 426.4, 453.2, 480.6, 508.7, 535.5, 563.6, 591, 619.8, 648, 677.5, 704.9, 730.3, 752.1, 767.7, 783.9, 801.1, 819.4, 838.4, 858.3],
        # in the sheet, bearing and slope are calculated values
        # but I think it'd be more convenient to put them in gpx_to_json()
        # so you don't have to recompute them each time
        "bearing from prev": [None, 73.89, 62.00, 63.93, 63.00, 61.47, 63.00, 63.93, 63.00, 59.33, 62.00, 62.00, 60.93, 58.15, 59.33, 59.33, 59.33, 63.00, 58.92, 59.33, 58.92, 60.44, 59.99, 58.92, 60.99, 60.44, 56.88, 59.51, 84.52, 122.1, 102.7, 85.34, 46.43, 26.79],
        "slope from prev": [None, 0.002, 0.007, -0.011, -0.026, -0.021, 0.000, -0.007, -0.007, 0.000, 0.000, 0.000, -0.012, 0.019, 0.004, 0.007, 0.000, -0.007, -0.004, 0.000, -0.007, -0.011, 0.007, -0.007, -0.020, -0.018, -0.020, -0.009, -0.038, -0.031, -0.006, 0.022, 0.042, 0.045]
    }
} # The data is being stored as {data type: [all timesteps]}, just because it makes it easier to write the above code



print(course)

# def singleTimestep(time=0, dist=0, speed=0.3, slope=0, roughness = 0,
#                    windSpeed=2, windAngle=math.pi, #radians, where 0 = headwind
#                    timestepSize=1):
#     headwindSpeed = math.cos(windAngle) * windSpeed
#     relativeHeadwind = speed + headwindSpeed
#     windDensity =
#     #powerAero = 0.5 * "relative wind speed at 1m"^3 * CDA
#     ## within that:
#     ## "relative wind speed at 1m" = a guess based on the roughness???
#     #So the wind speed

