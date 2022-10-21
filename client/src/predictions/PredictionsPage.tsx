import { Container, Paper, Typography } from '@mui/material';
import { Box } from '@mui/system';
import DropButtons from './Drop_Buttons';
import OutputPredictionsUI from './OutputPredictions';
import ParamFields from './ParamFields';
import SplitMetrics from './SplitMetrics';
import useAthleteReducer from './useAthleteReducer';
import useMechanicalReducer from './useMechanicalReducer';
import useEnvironmentReducer from './useEnvironmentReducer';
import useCourseParamsReducer from './useCourseParamsReducer';
import { makePrediction } from './PredictionsAPI';
import { useEffect, useState } from 'react';
import CourseMap from '../courses/CourseMap';
import { getCourse } from '../courses/CourseApi';
import { CourseData } from '../courses/ManageCoursesPage';
import { useMapState } from '../courses/useMapState';

export default function RenderPredictionsPage() {
    const { athlete, athleteDispatch, originalAthlete } = useAthleteReducer();
    const { mechanical, mechanicalDispatch } = useMechanicalReducer();
    const { environment, environmentDispatch } = useEnvironmentReducer();
    const { courseParams, courseParamsDispatch } = useCourseParamsReducer();
    const [selectedCourseId, setCourseId] = useState<number | null>(10);
    const [selectedCourse, setCourse] = useState<CourseData | null>(null);
    const { points, splits, boundsLatLng } = useMapState(
        selectedCourse?.gps_data,
    );

    useEffect(() => {
        if (selectedCourseId === null) {
            setCourse(null);
            return;
        }

        getCourse(selectedCourseId).then(setCourse);
    }, [selectedCourseId]);

    const handlePredictionClick = () => {
        makePrediction({
            athlete_parameters: athlete,
            mechanical_parameters: mechanical,
            environment_parameters: environment,
            course_parameters: courseParams,
            course_ID: selectedCourseId,
        });
    };

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

                <Container
                    maxWidth="md"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        '& > :not(style)': {
                            m: 1,
                        },
                    }}
                >
                    <Paper
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            minHeight: '25rem',
                            textAlign: 'center',
                            flexGrow: 1,
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                flexGrow: 1,
                                flexDirection: 'column',
                                display: 'flex',
                                height: '100%',
                            }}
                        >
                            <CourseMap
                                points={points}
                                splits={splits}
                                hoverPoint={null}
                                hoverSplitIdx={null}
                                bounds={boundsLatLng}
                            />
                        </Box>
                    </Paper>
                    <DropButtons
                        athleteDispatch={athleteDispatch}
                        onCourseSelected={setCourseId}
                        onPredictionClick={handlePredictionClick}
                    />
                </Container>

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
