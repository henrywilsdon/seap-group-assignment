import { Box } from '@mui/system';
import { Typography } from '@mui/material';
import ParamFields from './ParamFields';
import OutputPredictionsUI from './OutputPredictions';
import DropButtons from './Drop_Buttons';
import CourseMap from './CourseMap';
import SplitMetrics from './SplitMetrics';

function RenderPredictionsPage() {
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
                    <DropButtons></DropButtons>
                </Box>

                <Box>
                    <ParamFields></ParamFields>
                </Box>
            </Box>
        </div>
    );
}

export default RenderPredictionsPage;
