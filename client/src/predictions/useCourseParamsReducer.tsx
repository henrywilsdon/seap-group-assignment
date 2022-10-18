import { Dispatch, useCallback, useState } from 'react';

export interface CourseParamsInputState {
    minSlopeThreshold: string;
    maxSlopeThreshold: string;
}

export type CourseParamsAction =
    | { type: 'setMinSlopeThreshold'; minSlopeThreshold: string }
    | { type: 'setMaxSlopeThreshold'; maxSlopeThreshold: string }
    | { type: 'clear' };

const createEmptyCourseParams = (): CourseParamsInputState => ({
    minSlopeThreshold: '',
    maxSlopeThreshold: '',
});

export default function useCourseParamsReducer(): {
    courseParams: CourseParamsInputState;
    courseParamsDispatch: Dispatch<CourseParamsAction>;
} {
    // Course Parameters that can be tweaked
    const [courseParams, setCourseParams] = useState(createEmptyCourseParams);

    // We have to use the useCallback hook so that this function is not recreated
    // on each render causing all components it is passed too to also be re-rendered
    // for no good reason(React things...)
    const courseParamsDispatch = useCallback((action: CourseParamsAction) => {
        if (action.type === 'setMinSlopeThreshold') {
            setCourseParams((prevCourseParamsState) => ({
                ...prevCourseParamsState,
                minSlopeThreshold: action.minSlopeThreshold,
            }));
        } else if (action.type === 'setMaxSlopeThreshold') {
            setCourseParams((prevCourseParamsState) => ({
                ...prevCourseParamsState,
                maxSlopeThreshold: action.maxSlopeThreshold,
            }));
        } else if (action.type === 'clear') {
            setCourseParams(createEmptyCourseParams());
        } else {
            throw new Error('Unknown action');
        }
    }, []);

    return {
        courseParams,
        courseParamsDispatch,
    };
}
