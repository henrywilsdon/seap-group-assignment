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
import React, { Dispatch, useEffect, useRef, useState } from 'react';
import { AthleteData, getAthletes } from '../athletes/athletesAPI';
import { AthleteInputState } from './useAthleteReducer';

type Props = {
    athleteDispatch: Dispatch<
        { type: 'setAthlete'; athlete: AthleteInputState } | { type: 'clear' }
    >;
    onPredictionClick: () => any;
};

function DropButtons(props: Props) {
    const { athleteDispatch, onPredictionClick } = props;
    const [selectedAthleteId, setSelectedAthleteId] = useState<number | ''>('');
    const [allAthletes, setAllAthletes] = useState<AthleteData[]>([]);
    const prevSelectedAthleteId = useRef<number | ''>('');

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

    const renderAthleteOptions = () => {
        return allAthletes.map((a) => (
            <MenuItem value={a.id}>{a.fullName}</MenuItem>
        ));
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
                            value=""
                        >
                            <MenuItem value={1}>Course1</MenuItem>
                            <MenuItem value={2}>Course2</MenuItem>
                            <MenuItem value={3}>Course3</MenuItem>
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
                            value=""
                        >
                            <MenuItem value={1}>Prediction1</MenuItem>
                            <MenuItem value={2}>Prediction2</MenuItem>
                            <MenuItem value={3}>Prediction3</MenuItem>
                        </Select>
                    </FormControl>

                    <Button
                        variant="contained"
                        onClick={() => {
                            //Change to necessary functionality
                            alert('Button Clicked');
                        }}
                    >
                        Save Prediction
                    </Button>

                    <Button variant="contained" onClick={onPredictionClick}>
                        Calculate Metrics
                    </Button>

                    <Button
                        variant="contained"
                        onClick={() => {
                            //Change to necessary functionality
                            alert('Button Clicked');
                        }}
                    >
                        Reset Course
                    </Button>
                </Paper>
            </Box>
        </div>
    );
}

export default DropButtons;
