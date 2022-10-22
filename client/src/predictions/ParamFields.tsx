import { Box } from '@mui/system';
import { Dispatch } from 'react';
import AthleteParams from './AthleteParams';
import CourseParams from './CourseParams';
import EnvironmentParams from './EnvironmentParams';
import MechanicalParams from './MechanicalParams';
import { AthleteAction, AthleteInputState } from './useAthleteReducer';
import { MechanicalAction, MechanicalInputState } from './useMechanicalReducer';
import {
    EnvironmentAction,
    EnvironmentInputState,
} from './useEnvironmentReducer';
import {
    CourseParamsAction,
    CourseParamsInputState,
} from './useCourseParamsReducer';

type Props = {
    athlete: AthleteInputState;
    originalAthlete: AthleteInputState;
    athleteDispatch: Dispatch<AthleteAction>;
    mechanical: MechanicalInputState;
    mechanicalDispatch: Dispatch<MechanicalAction>;
    environment: EnvironmentInputState;
    environmentDispatch: Dispatch<EnvironmentAction>;
    courseParams: CourseParamsInputState;
    courseParamsDispatch: Dispatch<CourseParamsAction>;
};

function ParamFields(props: Props) {
    const {
        athlete,
        originalAthlete,
        athleteDispatch,
        mechanical,
        mechanicalDispatch,
        environment,
        environmentDispatch,
        courseParams,
        courseParamsDispatch,
    } = props;

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <AthleteParams
                    athlete={athlete}
                    originalAthlete={originalAthlete}
                    athleteDispatch={athleteDispatch}
                />
                <MechanicalParams
                    mechanical={mechanical}
                    mechanicalDispatch={mechanicalDispatch}
                />
                <EnvironmentParams
                    environment={environment}
                    environmentDispatch={environmentDispatch}
                />
                <CourseParams
                    courseParams={courseParams}
                    courseParamsDispatch={courseParamsDispatch}
                />
            </Box>
        </div>
    );
}

export default ParamFields;
