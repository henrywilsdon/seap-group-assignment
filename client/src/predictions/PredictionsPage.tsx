import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import CourseMap from './CourseMap';
import DropButtons from './Drop_Buttons';
import OutputPredictionsUI from './OutputPredictions';
import ParamFields from './ParamFields';
import SplitMetrics from './SplitMetrics';
import useAthleteReducer from './useAthleteReducer';
import useMechanicalReducer from './useMechanicalReducer';
import useEnvironmentReducer from './useEnvironmentReducer';
import useCourseParamsReducer from './useCourseParamsReducer';

export default function RenderPredictionsPage() {
    const { athlete, athleteDispatch, originalAthlete } = useAthleteReducer();
    const { mechanical, mechanicalDispatch } = useMechanicalReducer();
    const { environment, environmentDispatch } = useEnvironmentReducer();
    const { courseParams, courseParamsDispatch } = useCourseParamsReducer();

    return (
        <div>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        '& > :not(style)': {
                            p: 1,
                        },
                    }}
                >
                    <Typography variant="h6">Predictions Page</Typography>

                    {/* Add external functions here to render them, change as needed */}
                    <OutputPredictionsUI></OutputPredictionsUI>
                    <SplitMetrics></SplitMetrics>
                </Box>

                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {
                            p: 1,
                        },
                    }}
                >
                    <CourseMap></CourseMap>
                    <DropButtons athleteDispatch={athleteDispatch} />
                </Box>

                <Box>
                    <ParamFields
                        athlete={athlete}
                        originalAthlete={originalAthlete}
                        athleteDispatch={athleteDispatch}
                        mechanical={mechanical}
                        mechanicalDispatch={mechanicalDispatch}
                        environment={environment}
                        environmentDispatch={environmentDispatch}
                        courseParams={courseParams}
                        courseParamsDispatch={courseParamsDispatch}
                    />
                </Box>
            </Box>
        </div>
    );
}
