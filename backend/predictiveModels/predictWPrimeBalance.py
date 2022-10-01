from temporaryModels import *
import math

def predict_w_prime_balance(course: CourseModel, prev_w_prime_balance, power_in) -> float:
    # this takes place in the columns Calcs!$X:$AA

    cs = course.static # for brevity

    dcp = min(0, -((power_in*(1/cs.mechanical_efficiency))-cs.cp))

    if (power_in*(1/cs.mechanical_efficiency))-cs.cp > 0:
        ot_energy = power_in * (1/cs.mechanical_efficiency) * cs.timestep_size
    else:
        ot_energy = 0

    if cs.w_prime_recovery_function == 1:
        if dcp != 0:
            t_prime = 2287.2 * dcp ** -0.688
        else:
            t_prime = 0
    elif cs.w_prime_recovery_function == 2:
        if dcp != 0:
            t_prime = cs.w_prime / dcp
        else:
            t_prime = 0
    elif cs.w_prime_recovery_function == 3:
        t_prime = 546 * (math.e ** (-0.01 * dcp)) + 316
    else:
        t_prime = 0
        # cs.w_prime_recovery_function should ALWAYS be 1, 2 or 3, and in an ideal world should throw an error if it's not - but the sheet supresses that error by setting t_prime to 0 instead


    if dcp == 0:
        w_prime_balance = prev_w_prime_balance - ot_energy
    else:
        w_prime_balance = cs.w_prime-(cs.w_prime-prev_w_prime_balance)*(math.e**(-cs.timestep_size/t_prime))


    return w_prime_balance