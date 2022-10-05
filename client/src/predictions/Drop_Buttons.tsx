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
import React from 'react';

function DropButtons() {
    const [athlete, setAthlete] = React.useState('');

    const handleEvent = (event: SelectChangeEvent) => {
        setAthlete(event.target.value as string);
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
                            id="Select_Athlete"
                            value={athlete}
                            label="Select Athlete"
                            onChange={handleEvent}
                        >
                            <MenuItem value={1}>Athlete1</MenuItem>
                            <MenuItem value={2}>Athlete2</MenuItem>
                            <MenuItem value={3}>Athlete3</MenuItem>
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
                            value={athlete}
                            label="Select Course"
                            onChange={handleEvent}
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
                            value={athlete}
                            label="Load Prediction"
                            onChange={handleEvent}
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

                    <Button
                        variant="contained"
                        onClick={() => {
                            //Change to necessary functionality
                            alert('Button Clicked');
                        }}
                    >
                        Recalculate Metrics
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
