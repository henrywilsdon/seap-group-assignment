import { AthleteInputState } from './useAthleteReducer';
import { CourseParamsInputState } from './useCourseParamsReducer';
import { EnvironmentInputState } from './useEnvironmentReducer';
import { MechanicalInputState } from './useMechanicalReducer';

export type PredictionObjects = {
    athlete_parameters: AthleteInputState;
    mechanical_parameters: MechanicalInputState;
    course_parameters: CourseParamsInputState;
    environment_parameters: EnvironmentInputState;
    course_ID: number; //  Need to add when select course is implemented
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

//export{}
