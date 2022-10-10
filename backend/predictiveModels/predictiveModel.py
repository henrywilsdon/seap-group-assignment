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
    cd = course.dynamic

    if not is_first:
        speed += acceleration * cs.timestep_size
        distance += speed * cs.timestep_size
    # yes, that's correct: speed uses the PRIOR acceleration, but distance uses the CURRENT speed

    # calculates what index you're up to in course.dynamic, based on your current distance
    index = None
    for checkedIndex in reversed(range(len(cd.distance))):
        if cd.distance[checkedIndex] <= distance:
            index = checkedIndex
            break

    # the bulk of the 'predict' stuff (where it calls other functions)
    power_aero_func = predict_power_aero(course, distance, speed, index)
    power_aero = power_aero_func["power_aero"]
    yaw = power_aero_func["yaw"]
    power_gravity = predict_power_gravity(course, distance, speed, index)
    power_in = predict_power_in(course, distance, index)
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
                                segment=cd.segment[index],
                                power_in=power_in,
                                yaw=yaw,
                                elevation=cd.ele[index]
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
    is_first = True

    segments_data = {} # Dictionary not list, because segments are 1-indexed
    for index in set(course.dynamic.segment):
        segments_data[index] = SingleSegmentData()
    timesteps_data = AllTimestepsData()
    full_course_data = FullCourseData()

    while current_distance < max_distance:

        single_out = predict_single_timestep(course=course,
                                             w_prime_balance=current_w_prime_balance,
                                             distance=current_distance,
                                             speed=current_speed,
                                             acceleration=current_acceleration,
                                             is_first=is_first)

        # ADDS THE PER-SEGMENT DATA TO THE OUTPUT
        segments_data[single_out.segment].duration += cs.timestep_size
        segments_data[single_out.segment].min_w_prime_balance = min(single_out.w_prime_balance, segments_data[single_out.segment].min_w_prime_balance)
        segments_data[single_out.segment].power_in += single_out.power_in
        segments_data[single_out.segment].distance += (single_out.distance - current_distance)
        segments_data[single_out.segment].total_yaw += single_out.yaw # used as an intermediate step in calculating average yaw
        segments_data[single_out.segment].timesteps += 1
        if single_out.speed >= 40:
            segments_data[single_out.segment].total_yaw_over_40kmh += single_out.yaw
            segments_data[single_out.segment].timesteps_over_40kmh += 1

        # ADDS THE FULL-COURSE DATA TO THE OUTPUT
        full_course_data.duration += cs.timestep_size
        full_course_data.min_w_prime_balance = min(single_out.w_prime_balance, full_course_data.min_w_prime_balance)
        full_course_data.power_in += single_out.power_in
        full_course_data.distance += (single_out.distance - current_distance)
        full_course_data.total_yaw += single_out.yaw  # used as an intermediate step in calculating average yaw
        full_course_data.timesteps += 1
        if single_out.speed >= 40:
            full_course_data.total_yaw_over_40kmh += single_out.yaw
            full_course_data.timesteps_over_40kmh += 1

        # ADDS THE PER-TIMESTEP DATA TO THE OUTPUT
        timesteps_data.elevation += [single_out.elevation]
        timesteps_data.w_prime_balance += [single_out.w_prime_balance]
        timesteps_data.power_in += [single_out.power_in]
        timesteps_data.speed += [single_out.speed]
        timesteps_data.yaw += [single_out.yaw]

        # MAINTAINS THE LIST OF DATA USED IN THE CALCULATIONS
        current_distance = single_out.distance
        current_speed = single_out.speed
        current_acceleration = single_out.acceleration
        current_time += cs.timestep_size
        current_w_prime_balance = single_out.w_prime_balance
        is_first = False

    # CONVERTS TOTALS TO AVERAGES IN PER-SEGMENT DATA
    for index in segments_data:
        if segments_data[index].timesteps > 0:
            segments_data[index].average_yaw = segments_data[index].total_yaw / segments_data[index].timesteps
        if segments_data[index].timesteps_over_40kmh > 0:
            segments_data[index].average_yaw_above_40kmh = segments_data[index].total_yaw_over_40kmh / segments_data[index].timesteps_over_40kmh

    # CONVERTS TOTALS TO AVERAGES IN FULL-COURSE DATA
    if full_course_data.timesteps > 0:
        full_course_data.average_yaw = full_course_data.total_yaw / full_course_data.timesteps
    if full_course_data.timesteps_over_40kmh > 0:
        full_course_data.average_yaw_above_40kmh = full_course_data.total_yaw_over_40kmh / full_course_data.timesteps_over_40kmh

    return PredictEntireCourseOutput(segments_data=segments_data, full_course_data=full_course_data, timesteps_data=timesteps_data)

toprint = predict_entire_course(CourseModel())
print(toprint.segments_data)
print(toprint.full_course_data)
print(toprint.timesteps_data)
x=1

# print("Duration:  ", toprint.duration)
# print("Min W` bal:", toprint.min_w_prime_balance)




# TODO: Add the proper output data for elevation, yaw, timestep, etc (rather than default values)
# TODO: all timesteps data
