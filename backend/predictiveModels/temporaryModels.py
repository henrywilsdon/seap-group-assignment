# WHY THIS FILE EXISTS:
# In the final version of this program,
# the predictiveModel will take the classes listed in Django/api/models.py
# but I can't import that into my code without everything breaking for some reason.
# So in the meantime, this file duplicates the functions that are in that file,
# with the only difference being that the fields like models.FloatField()
# are replaced with plausible values for that field.

class StaticModel():

    # the bike and its rider
    mass_rider = 71
    mass_bike = 7
    mass_other = 1
    delta_kg = 0 # mass_total is mass_rider + mass_bike + mass_other + delta_kg
    crr = 0.0025
    mechanical_efficiency = 0.98
    moi_whl_front = 0.08 # in the spreadsheet, written as MoI (cap i, not lowercase l)
    moi_whl_rear = 0.08
    wheel_radius = 0.335

    # the cp model
    cp = 430 # also called ftp
    w_prime = 35000 # how much you start with in the bucket ('current amount in the bucket' is called balance and is not a static value).
    w_prime_recovery_function = 1
    below_steady_state_max_slope = -0.01
    below_steady_state_power_usage = 0.02
    over_threshold_min_slope = 0.075
    over_threshold_power_usage = 1.1
    steady_state_power_usage = 0.91

    # the position (pose/stance) of the rider
    climbing_cda_increment = 0.04
    climbing_min_slope = 0.3
    descending_cda_increment = -0.005
    descending_max_slope = -0.01

    # the environment
    wind_direction = 30
    wind_speed_mps = 2
    wind_density = 1.13

    # technical details needed for the predictive model
    timestep_size = 0.5 # also called dt
    starting_distance = 0.1
    starting_speed = 0.3

    # uncategorised, but definitely used
    delta_cda = 0
    delta_watts = -20

class DynamicModel():
    lat = [35.37245, 35.37262, 35.37277, 35.37292, 35.37307, 35.37323, 35.37338, 35.37353, 35.37368, 35.37384, 35.37399, 35.37414, 35.37429, 35.37445, 35.37461, 35.37477, 35.37493, 35.37508, 35.37525, 35.37541, 35.37558, 35.37574, 35.37591, 35.37608, 35.37625, 35.37641, 35.37657, 35.3767, 35.37672, 35.37662, 35.37657, 35.37659, 35.37673, 35.3769]
    lon = [138.92742, 138.9279, 138.92813, 138.92838, 138.92862, 138.92886, 138.9291, 138.92935, 138.92959, 138.92981, 138.93004, 138.93027, 138.93049, 138.9307, 138.93092, 138.93114, 138.93136, 138.9316, 138.93183, 138.93205, 138.93228, 138.93251, 138.93275, 138.93298, 138.93323, 138.93346, 138.93366, 138.93384, 138.93401, 138.93414, 138.93432, 138.93452, 138.93464, 138.93471]
    ele = [593, 593.1, 593.3, 593, 592.3, 591.7, 591.7, 591.5, 591.3, 591.3, 591.3, 591.3, 591, 591.5, 591.6, 591.8, 591.8, 591.6, 591.5, 591.5, 591.3, 591, 591.2, 591, 590.4, 589.9, 589.4, 589.2, 588.6, 588.1, 588, 588.4, 589.2, 590.1]
    distance = [0, 47.4, 74.2, 102.3, 129.7, 157.8, 185.2, 213.4, 240.8, 267.5, 294.2, 320.9, 346.9, 373, 399.7, 426.4, 453.2, 480.6, 508.7, 535.5, 563.6, 591, 619.8, 648, 677.5, 704.9, 730.3, 752.1, 767.7, 783.9, 801.1, 819.4, 838.4, 858.3]
    # in the sheet, bearing and slope are calculated values
    # but I think it'd be more convenient to put them in gpx_to_json()
    # so you don't have to recompute them each time
    bearing_from_prev = [None, 73.89, 62.00, 63.93, 63.00, 61.47, 63.00, 63.93, 63.00, 59.33, 62.00, 62.00, 60.93, 58.15, 59.33, 59.33, 59.33, 63.00, 58.92, 59.33, 58.92, 60.44, 59.99, 58.92, 60.99, 60.44, 56.88, 59.51, 84.52, 122.1, 102.7, 85.34, 46.43, 26.79]
    slope_from_prev = [None, 0.002, 0.007, -0.011, -0.026, -0.021, 0.000, -0.007, -0.007, 0.000, 0.000, 0.000, -0.012, 0.019, 0.004, 0.007, 0.000, -0.007, -0.004, 0.000, -0.007, -0.011, 0.007, -0.007, -0.020, -0.018, -0.020, -0.009, -0.038, -0.031, -0.006, 0.022, 0.042, 0.045]
    roughness_class = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2] # baked into the spreadsheet, at 'Course info'!$Q$21:$R$30
    segment = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2]



class CourseModel():
    static = StaticModel()
    dynamic = DynamicModel()

class SingleTimestepOutput():
    def __init__(self,
                 distance,
                 speed,
                 acceleration,
                 w_prime_balance,
                 segment,
                 power_in,
                 yaw,
                 elevation
                 ):
        self.distance = distance
        self.speed = speed
        self.acceleration = acceleration
        self.w_prime_balance = w_prime_balance
        self.segment=segment
        self.power_in=power_in
        self.yaw=yaw
        self.elevation=elevation

class SingleSegmentData():
    duration = 0
    min_w_prime_balance = float("inf")
    power_in = 0
    distance = 0
    average_yaw = None
    average_yaw_above_40kmh = None
    total_yaw = 0
    total_yaw_over_40kmh = 0
    timesteps = 0
    timesteps_over_40kmh = 0

class FullCourseData():
    duration = 0
    min_w_prime_balance = float("inf")
    power_in = 0
    distance = 0
    average_yaw = None
    average_yaw_above_40kmh = None
    total_yaw = 0
    total_yaw_over_40kmh = 0
    timesteps = 0
    timesteps_over_40kmh = 0

class AllTimestepsData():
    elevation = []
    w_prime_balance = []
    power_in = []
    speed = []
    yaw = []


class PredictEntireCourseOutput():
    def __init__(self,
                 segments_data, # "segmented" means "one data point per segment, and also for the entire course"
                 full_course_data,
                 timesteps_data, # "timestep" means "one data point for every timestep"
                 ):

        self.segments_data = segments_data, # list of SegmentData
        self.full_course_data = full_course_data, # a single FullCourseData
        self.timesteps_data = timesteps_data # a single TimestepsData





