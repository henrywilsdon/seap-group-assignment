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
import { makePrediction, PredictionOutput } from './PredictionsAPI';
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
    const [selectedCourseId, setCourseId] = useState<number | null>(null);
    const [selectedCourse, setCourse] = useState<CourseData | null>(null);
    const { points, splits, boundsLatLng } = useMapState(
        selectedCourse?.gps_data,
    );
    const [predictionOutput, setPredictionOutput] =
        useState<PredictionOutput | null>(() => ({
            full_course_data: {
                average_yaw: 0.01865052145501622,
                average_yaw_above_40kmh: 0,
                distance: 44194.11108322753,
                duration: 3008.5,
                min_w_prime_balance: 35000.0,
                power_in: 2187023.057999831,
            },
            segments: [
                {
                    average_yaw: 0.5572512365277602,
                    average_yaw_above_40kmh: 0,
                    distance: 10208.640819142618,
                    duration: 715.0,
                    min_w_prime_balance: 35000.0,
                    power_in: 519767.819999987,
                    timesteps: 1430,
                },
                {
                    average_yaw: -0.3266481600192335,
                    average_yaw_above_40kmh: 0,
                    distance: 19351.160570127508,
                    duration: 1307.0,
                    min_w_prime_balance: 35000.0,
                    power_in: 950121.0360000404,
                    timesteps: 2614,
                },
                {
                    average_yaw: 0.0857623971872338,
                    average_yaw_above_40kmh: 0,
                    distance: 14634.309693957402,
                    duration: 986.5,
                    min_w_prime_balance: 35000.0,
                    power_in: 717134.2020000111,
                    timesteps: 1973,
                },
            ],
            time_steps_data: {
                distance: [],
                elevation: [],
                power_in: [],
                speed: [],
                w_prim_balance: [],
                yaw: [],
            },
        }));

    useEffect(() => {
        if (selectedCourseId === null) {
            setCourse(null);
            return;
        }

        getCourse(selectedCourseId).then(setCourse);
    }, [selectedCourseId]);

    const handlePredictionClick = () => {
        if (selectedCourseId == null) {
            return;
        }
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
                    <Typography variant="h4">Predictions</Typography>

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
