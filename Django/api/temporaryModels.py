
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
    distance = []

class PredictEntireCourseOutput():
    def __init__(self,
                 segments_data,
                 full_course_data,
                 timesteps_data, # "timestep" means "one data point for every timestep"
                 ):

        self.segments_data = segments_data, # list of SingleSegmentData
        self.full_course_data = full_course_data, # a single FullCourseData
        self.timesteps_data = timesteps_data # a single AllTimestepsData





