import { AthleteInputState } from './useAthleteReducer';
import { CourseParamsInputState } from './useCourseParamsReducer';
import { EnvironmentInputState } from './useEnvironmentReducer';
import { MechanicalInputState } from './useMechanicalReducer';

export type PredictionObjects = {
    athlete_parameters: AthleteInputState;
    mechanical_parameters: MechanicalInputState;
    course_parameters: CourseParamsInputState;
    environment_parameters: EnvironmentInputState;
    course_ID: number;
};

export type PredictionOutput = {
    full_course_data: {
        average_yaw: number;
        average_yaw_above_40kmh: number | null;
        distance: number;
        duration: number;
        min_w_prime_balance: number;
        power_in: number;
    };
    segments: PredictionOutputSegment[];
    time_steps_data: PredictionOutputTimeSteps;
};

export interface PredictionOutputSegment {
    average_yaw: number;
    average_yaw_above_40kmh: number;
    distance: number;
    duration: number;
    min_w_prime_balance: number;
    power_in: number;
    timesteps: number;
}

export interface PredictionOutputTimeSteps {
    distance: number[];
    power_in: number[];
    speed: number[];
    yaw: number[];
    elevation: number[];
    w_prim_balance: number[];
}

/**
 * Make a new prediction
 */
export function makePrediction(
    predictionData: PredictionObjects,
): Promise<any> {
    console.log('makePrediction Request Called');
    return fetch('http://localhost:8000/api/prediction/', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(predictionData),
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        } else {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}
