import {
    Paper,
    Box,
    SelectChangeEvent,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from '@mui/material';
import React, {
    ChangeEvent,
    Dispatch,
    useEffect,
    useRef,
    useState,
} from 'react';
import { AthleteData, getAthletes } from '../athletes/athletesAPI';
import { AthleteInputState } from './useAthleteReducer';
import { getAllCourses } from '../courses/CourseApi';
import { CourseData } from '../courses/ManageCoursesPage';
import { predictionPresets } from './PredictionsAPI';

type Props = {
    athleteDispatch: Dispatch<
        { type: 'setAthlete'; athlete: AthleteInputState } | { type: 'clear' }
    >;
    onCourseSelected: (courseId: number) => any;
    onPredictionClick: () => any;
    onPredictionPresetChange: (presetIdx: number) => void;
    disableCalculate?: boolean;
};

function DropButtons(props: Props) {
    const {
        athleteDispatch,
        onCourseSelected,
        onPredictionClick,
        onPredictionPresetChange,
        disableCalculate,
    } = props;
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | ''>('');
    const [allAthletes, setAllAthletes] = useState<AthleteData[]>([]);
    const prevSelectedAthleteId = useRef<number | ''>('');

    const [selectedCourseId, setSelectedCourseId] = useState<number | ''>('');
    const [allCourses, setAllCourses] = useState<CourseData[]>([]);

    useEffect(() => {
        getAthletes().then((_athletes) => {
            setAllAthletes(_athletes);
        });
    }, []);

    // Update selected athlete
    useEffect(() => {
        // Selected id hasn't changed so do nothing
        if (selectedAthleteId === prevSelectedAthleteId.current) {
            return;
        }

        // Selected athlete id is not blank ''
        if (selectedAthleteId) {
            prevSelectedAthleteId.current = selectedAthleteId;

            // Selected athelete exists
            const selectedAthlete = allAthletes.find(
                (a) => a.id === selectedAthleteId,
            );
            if (selectedAthlete) {
                athleteDispatch({
                    type: 'setAthlete',
                    athlete: {
                        id: selectedAthlete.id as number,
                        fullName: selectedAthlete.fullName,
                        riderMass: String(selectedAthlete.riderMass),
                        bikeMass: String(selectedAthlete.bikeMass),
                        otherMass: String(selectedAthlete.otherMass),
                        totalMass: String(
                            selectedAthlete.riderMass +
                                selectedAthlete.bikeMass +
                                selectedAthlete.otherMass,
                        ),
                        cp: String(selectedAthlete.cp),
                        wPrime: String(selectedAthlete.wPrime),
                    },
                });
                return;
            }
        }

        // No athlete selected or athlete does not exist
        athleteDispatch({ type: 'clear' });
    }, [selectedAthleteId, allAthletes, athleteDispatch]);

    const handleSelectedAthleteChange = (
        event: SelectChangeEvent<typeof selectedAthleteId>,
    ) => {
        const value = event.target.value;
        const newId = typeof value === 'string' ? parseInt(value) : value;
        setSelectedAthleteId(newId);
    };

    const handlePredictionPresetChange = (event: any) => {
        onPredictionPresetChange(event.target.value as number);
    };

    const renderAthleteOptions = () => {
        return allAthletes.map((a) => (
            <MenuItem value={a.id}>{a.fullName}</MenuItem>
        ));
    };

    // Get courses from the backend
    useEffect(() => {
        getAllCourses()
            .then((_courses) => {
                setAllCourses(_courses);
            })
            .catch(console.warn);
    }, []);

    const handleSelectedCourseChange = (
        event: SelectChangeEvent<typeof selectedCourseId>,
    ) => {
        const value = event.target.value;
        const newId = typeof value === 'string' ? parseInt(value) : value;
        setSelectedCourseId(newId);
        onCourseSelected(newId);
    };

    const renderCourseOptions = () => {
        return allCourses.map((c) => (
            <MenuItem value={c.id}>{c.name}</MenuItem>
        ));
    };

    const renderPredictionPresets = () => {
        return predictionPresets.map((pp, i) => {
            return <MenuItem value={i}>{pp.label}</MenuItem>;
        });
    };

    return (
        <div className="DropButtons">
            <Box
                sx={{
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 2,
                    }}
                >
                    {/* Change FormControl to take in and use stored athlete objects */}
                    <FormControl fullWidth>
                        <InputLabel id="Select_Athlete">
                            Select Athlete
                        </InputLabel>
                        <Select
                            labelId="Select_Athlete"
                            value={selectedAthleteId}
                            label="Select Athlete"
                            onChange={handleSelectedAthleteChange}
                        >
                            {renderAthleteOptions()}
                        </Select>
                    </FormControl>

                    {/* Change FormControl to take in and use stored athlete objects */}
                    <FormControl fullWidth>
                        <InputLabel id="Select_Course">
                            Select Course
                        </InputLabel>
                        <Select
                            labelId="Select_Course"
                            id="Select_Course"
                            label="Select Course"
                            value={selectedCourseId}
                            onChange={handleSelectedCourseChange}
                        >
                            {renderCourseOptions()}
                        </Select>
                    </FormControl>

                    {/* Change FormControl to take in and use stored athlete objects */}
                    <FormControl fullWidth>
                        <InputLabel id="Load_Prediction">
                            Load Prediction
                        </InputLabel>
                        <Select
                            labelId="Load_Prediction"
                            id="Load_Prediction"
                            label="Load Prediction"
                            onChange={handlePredictionPresetChange}
                        >
                            {renderPredictionPresets()}
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={() => {
                            //Change to necessary functionality
                            alert('Button Clicked');
                        }}
                        disabled
                    >
                        Save Prediction
                    </Button>

                    <Button
                        variant="contained"
                        onClick={onPredictionClick}
                        disabled={disableCalculate}
                    >
                        Calculate Metrics
                    </Button>
                </Paper>
            </Box>
        </div>
    );
}

export default DropButtons;
