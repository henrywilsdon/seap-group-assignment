
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
    def __init__(self):
        self.duration = 0
        self.min_w_prime_balance = float("inf")
        self.power_in = 0
        self.distance = 0
        self.average_yaw = None
        self.average_yaw_above_40kmh = None
        self.total_yaw = 0
        self.total_yaw_over_40kmh = 0
        self.timesteps = 0
        self.timesteps_over_40kmh = 0

class FullCourseData():
    def __init__(self):
        self.duration = 0
        self.min_w_prime_balance = float("inf")
        self.power_in = 0
        self.distance = 0
        self.average_yaw = None
        self.average_yaw_above_40kmh = None
        self.total_yaw = 0
        self.total_yaw_over_40kmh = 0
        self.timesteps = 0
        self.timesteps_over_40kmh = 0

class AllTimestepsData():
    def __init__(self):
        self.elevation = []
        self.w_prime_balance = []
        self.power_in = []
        self.speed = []
        self.yaw = []
        self.distance = []

class PredictEntireCourseOutput():
    def __init__(self,
                 segments_data,
                 full_course_data,
                 timesteps_data, # "timestep" means "one data point for every timestep"
                 ):

        self.segments_data = segments_data, # list of SingleSegmentData
        self.full_course_data = full_course_data, # a single FullCourseData
        self.timesteps_data = timesteps_data # a single AllTimestepsData





