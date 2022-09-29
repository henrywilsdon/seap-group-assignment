import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import HandleParamFields from './HandleParamFields';
import HandleOutputPredictionsUI from './HandleOutputPredictions';
import HandleDropButtons from './HandleDropButtons';
import HandleCourseMap from './HandleCourseMap';
import HandleSplitMetrics from './SplitMetrics';

function HandlePredictionsPage() {
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
                    <HandleOutputPredictionsUI></HandleOutputPredictionsUI>
                    <HandleSplitMetrics></HandleSplitMetrics>
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
                    <HandleDropButtons></HandleDropButtons>
                </Box>

                <Box>
                    <HandleParamFields></HandleParamFields>
                </Box>
            </Box>
        </div>
    );
}

export default HandlePredictionsPage;
