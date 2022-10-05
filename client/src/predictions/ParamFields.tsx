import { Box } from '@mui/system';
import EnvironmentParams from './EnvironmentParams';
import MechanicalParams from './MechanicalParams';
import AthleteParams from './AthleteParams';
import CourseParams from './CourseParams';

function HandleParamFields() {
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
                <AthleteParams></AthleteParams>
                <CourseParams></CourseParams>
            </Box>
        </div>
    );
}

export default HandleParamFields;
