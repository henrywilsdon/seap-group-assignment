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

type BackendPredictionParams = {
    athlete_parameters: {
        name: string;
        rider_mass: number;
        bike_mass: number;
        other_mass: number;
        total_mass: number;
        CP_FTP: number;
        W_prime: number;
    };
    mechanical_parameters: {
        crr: number;
        mechanical_efficiency: number;
        mol_whl_front: number;
        mol_whl_rear: number;
        wheel_radius: number;
    };
    course_parameters: {
        course_id: number;
        min_slope_threshold: number;
        max_slope_threshold: number;
    };
    environment_parameters: {
        wind_direction: number;
        wind_speed_mps: number;
        wind_density: number;
    };
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
): Promise<PredictionOutput> {
    console.log('makePrediction Request Called');
    return fetch(
        'http://localhost:8000/api/prediction/' +
            predictionData.course_ID +
            '/',
        {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(frontendPredictionToBackend(predictionData)),
        },
    ).then(async (response) => {
        if (response.ok) {
            return (await response.json()).result;
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

/**
 * Convert frontend model to the backend model
 */
function frontendPredictionToBackend(
    fParams: PredictionObjects,
): BackendPredictionParams {
    return {
        athlete_parameters: {
            name: fParams.athlete_parameters.fullName,
            rider_mass: Number(fParams.athlete_parameters.riderMass),
            bike_mass: Number(fParams.athlete_parameters.bikeMass),
            other_mass: Number(fParams.athlete_parameters.otherMass),
            total_mass:
                Number(fParams.athlete_parameters.riderMass) +
                Number(fParams.athlete_parameters.bikeMass) +
                Number(fParams.athlete_parameters.otherMass),
            CP_FTP: Number(fParams.athlete_parameters.cp),
            W_prime: Number(fParams.athlete_parameters.wPrime),
        },
        mechanical_parameters: {
            crr: Number(fParams.mechanical_parameters.crrValue),
            mechanical_efficiency: Number(
                fParams.mechanical_parameters.mechEfficiency,
            ),
            mol_whl_front: Number(fParams.mechanical_parameters.molWhlFront),
            mol_whl_rear: Number(fParams.mechanical_parameters.molWhlRear),
            wheel_radius: Number(fParams.mechanical_parameters.wheelRadius),
        },
        course_parameters: {
            course_id: fParams.course_ID,
            min_slope_threshold: Number(
                fParams.course_parameters.minSlopeThreshold,
            ),
            max_slope_threshold: Number(
                fParams.course_parameters.maxSlopeThreshold,
            ),
        },
        environment_parameters: {
            wind_direction: Number(
                fParams.environment_parameters.windDirection,
            ),
            wind_speed_mps: Number(fParams.environment_parameters.windSpeed),
            wind_density: Number(fParams.environment_parameters.airDensity),
        },
    };
}

export const predictionPresets: Omit<
    PredictionObjects & { label: string },
    'course_ID'
>[] = [
    {
        label: 'Test1',
        athlete_parameters: {
            id: -1,
            fullName: 'test',
            riderMass: '71',
            bikeMass: '7',
            otherMass: '1',
            totalMass: '79',
            cp: '430',
            wPrime: '35000',
        },
        mechanical_parameters: {
            crrValue: '0.0025',
            mechEfficiency: '0.98',
            molWhlFront: '0.08',
            molWhlRear: '0.08',
            wheelRadius: '0.335',
        },
        course_parameters: {
            minSlopeThreshold: '0.03',
            maxSlopeThreshold: '-0.01',
        },
        environment_parameters: {
            windDirection: '30',
            windSpeed: '2',
            airDensity: '1.13',
        },
    },
];
