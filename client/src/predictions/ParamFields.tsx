import { Box } from '@mui/system';
import { Dispatch } from 'react';
import AthleteParams from './AthleteParams';
import CourseParams from './CourseParams';
import EnvironmentParams from './EnvironmentParams';
import MechanicalParams from './MechanicalParams';
import { AthleteAction, AthleteInputState } from './useAthleteReducer';

type Props = {
    athlete: AthleteInputState;
    originalAthlete: AthleteInputState;
    athleteDispatch: Dispatch<AthleteAction>;
};

function ParamFields(props: Props) {
    const { athlete, originalAthlete, athleteDispatch } = props;

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
                <MechanicalParams></MechanicalParams>
                <EnvironmentParams></EnvironmentParams>
                <AthleteParams
                    athlete={athlete}
                    originalAthlete={originalAthlete}
                    athleteDispatch={athleteDispatch}
                />
                <CourseParams></CourseParams>
            </Box>
        </div>
    );
}

export default ParamFields;
