from temporaryModels import *
import math
from predictPowerAero import *
from predictPowerGravity import *
from predictPowerIn import *
from predictPowerRoll import *
from predictWPrimeBalance import *

def predict_single_timestep(course: CourseModel, # time doesn't need to be an argument here
                            w_prime_balance: float,
                            distance: float,
                            speed: float,
                            acceleration: float) \
                            -> SingleTimestepOutput:

    # for brevity
    cs = course.static
    cd = course.dynamic

    speed += acceleration * cs.timestep_size
    distance += speed * cs.timestep_size
    # yes, that's correct: speed uses the PRIOR acceleration, but distance uses the CURRENT speed

    # the bulk of the 'predict' stuff (where it calls other functions)

    power_aero = predict_power_aero(course, distance, speed, acceleration)
    power_gravity = predict_power_gravity(course, distance, speed, acceleration)
    power_in = predict_power_in(course, distance, speed, acceleration)
    power_roll = predict_power_roll(course, distance, speed, acceleration)
    w_prime_balance = predict_w_prime_balance(course, w_prime_balance, power_in)

    power_net = power_in - power_aero - power_roll - power_gravity
    propulsive_force = power_net / speed
    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other
    acceleration = propulsive_force / (mass_total + ( (cs.moi_whl_front + cs.moi_whl_rear) / cs.wheel_radius**2))

    return SingleTimestepOutput(distance=distance,
                                speed=speed, # current speed is based on the previous speed and acceleration
                                acceleration=acceleration,
                                w_prime_balance=w_prime_balance
                                )

def predict_entire_course(course) -> PredictEntireCourseOutput:

    max_distance = course.dynamic.distance[-1] # last distance in list
    current_distance = course.static.starting_distance
    current_speed = course.static.starting_speed
    current_acceleration = 0
    current_time = 0
    current_w_prime_balance = course.static.w_prime
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
        current_time += course.static.timestep_size
        min_w_prime_balance = min(current_w_prime_balance, single_out.w_prime_balance)
        current_w_prime_balance = single_out.w_prime_balance

    return PredictEntireCourseOutput(duration=current_time, min_w_prime_balance=min_w_prime_balance)

toprint = predict_entire_course(CourseModel())
print(toprint.duration)


# TODO: Add additional arguments to functions (even if unnecessary)

# TODO: Alexi starts working on power_aero
# TODO: Mohammad starts working on power_roll
# Once someone finishes a bit, just pick up the next one
# By the end of the week, finish all 5 functions




