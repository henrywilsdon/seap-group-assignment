import { Typography } from '@mui/material';
import { Box } from '@mui/system';
import HandleCourseMap from './HandleCourseMap';
import HandleDropButtons from './HandleDropButtons';
import HandleOutputPredictionsUI from './HandleOutputPredictions';
import HandleParamFields from './HandleParamFields';
import HandleSplitMetrics from './SplitMetrics';
import useAthleteReducer from './useAthleteReducer';

function HandlePredictionsPage() {
    const { athlete, athleteDispatch, originalAthlete } = useAthleteReducer();

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
                    <HandleCourseMap></HandleCourseMap>
                    <HandleDropButtons athleteDispatch={athleteDispatch} />
                </Box>

                <Box>
                    <HandleParamFields
                        athlete={athlete}
                        originalAthlete={originalAthlete}
                        athleteDispatch={athleteDispatch}
                    />
                </Box>
            </Box>
        </div>
    );
}

export default RenderPredictionsPage;
