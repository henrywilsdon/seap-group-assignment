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
