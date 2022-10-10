import pprint

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
                            acceleration: float,
                            is_first: bool) \
                            -> SingleTimestepOutput:

    cs = course.static # for brevity

    if not is_first:
        speed += acceleration * cs.timestep_size
        distance += speed * cs.timestep_size
    # yes, that's correct: speed uses the PRIOR acceleration, but distance uses the CURRENT speed

    # the bulk of the 'predict' stuff (where it calls other functions)
    power_aero = predict_power_aero(course, distance, speed)
    power_gravity = predict_power_gravity(course, distance, speed)
    power_in = predict_power_in(course, distance)
    power_roll = predict_power_roll(course, speed)
    w_prime_balance = predict_w_prime_balance(course, w_prime_balance, power_in)

    power_net = power_in - power_aero - power_roll - power_gravity
    propulsive_force = power_net / speed
    mass_total = cs.mass_rider + cs.mass_bike + cs.mass_other
    acceleration = propulsive_force / (mass_total + ( (cs.moi_whl_front + cs.moi_whl_rear) / cs.wheel_radius**2))

    return SingleTimestepOutput(distance=distance,
                                speed=speed, # current speed is based on the previous speed and acceleration
                                acceleration=acceleration,
                                w_prime_balance=w_prime_balance,
                                timestep=1, #TODO
                                segment=1, #TODO
                                power_in=power_in,
                                yaw=1 #TODO
                                )

def predict_entire_course(course) -> PredictEntireCourseOutput:

    cs = course.static # for brevity
    cd = course.dynamic

    max_distance = cd.distance[-1] # last distance in list
    current_distance = cs.starting_distance
    current_speed = cs.starting_speed
    current_acceleration = 0
    current_time = 0
    current_w_prime_balance = cs.w_prime
    min_w_prime_balance = float('inf')
    is_first = True

    segments_data = {} # Dictionary not list, because segments are 1-indexed
    for index in set(course.dynamic.segment):
        segments_data[index] = SingleSegmentData()
    timesteps_data = AllTimestepsData([], [], [], [], [])
    overall_data = FullCourseData

    while current_distance < max_distance:

        single_out = predict_single_timestep(course=course,
                                             w_prime_balance=current_w_prime_balance,
                                             distance=current_distance,
                                             speed=current_speed,
                                             acceleration=current_acceleration,
                                             is_first=is_first)

        # Adds the per-segment data
        segments_data[single_out.segment].duration += cs.timestep_size
        segments_data[single_out.segment].min_w_prime_balance = min(single_out.w_prime_balance, segments_data[single_out.segment].min_w_prime_balance)
        segments_data[single_out.segment].power_in += single_out.power_in
        segments_data[single_out.segment].distance += (single_out.distance - current_distance)
        segments_data[single_out.segment].total_yaw += single_out.yaw # used as an intermediate step in calculating average yaw
        segments_data[single_out.segment].timesteps += 1
        if single_out.speed >= 40:
            segments_data[single_out.segment].total_yaw_over_40kmh += single_out.yaw
            segments_data[single_out.segment].timesteps_over_40kmh += 1

        current_distance = single_out.distance
        current_speed = single_out.speed
        current_acceleration = single_out.acceleration
        current_time += cs.timestep_size
        min_w_prime_balance = min(current_w_prime_balance, single_out.w_prime_balance)
        current_w_prime_balance = single_out.w_prime_balance
        is_first = False

    for index in segments_data:
        if segments_data[index].timesteps > 0:
            segments_data[index].average_yaw = segments_data[index].total_yaw / segments_data[index].timesteps
        if segments_data[index].timesteps_over_40kmh > 0:
            segments_data[index].average_yaw_above_40kmh = segments_data[index].total_yaw_over_40kmh / segments_data[index].timesteps_over_40kmh

    return PredictEntireCourseOutput(segments_data=segments_data, overall_data=None, timesteps_data=None)

toprint = predict_entire_course(CourseModel()).segments_data
pprint.PrettyPrinter().pprint(toprint)
# print("Duration:  ", toprint.duration)
# print("Min W` bal:", toprint.min_w_prime_balance)





