import { Box } from '@mui/system';
import EnvironmentParamsUI from './EnvironmentParams';
import MechanicalParamsUI from './MechanicalParams';
import AthleteParamsUI from './AthleteParamsUI';
import CourseParamsUI from './CourseParamsUI';

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
                <MechanicalParamsUI></MechanicalParamsUI>
                <EnvironmentParamsUI></EnvironmentParamsUI>
                <AthleteParamsUI></AthleteParamsUI>
                <CourseParamsUI></CourseParamsUI>
            </Box>
        </div>
    );
}

export default HandleParamFields;
