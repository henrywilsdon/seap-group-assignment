import { Restore as RestoreIcon } from '@mui/icons-material';
import {
    Box,
    IconButton,
    InputAdornment,
    Paper,
    TextField,
    TextFieldProps,
    Tooltip,
    Typography,
} from '@mui/material';
import { ChangeEvent, Dispatch } from 'react';
import { AthleteAction, AthleteInputState } from './useAthleteReducer';

type Props = {
    athlete: AthleteInputState;
    originalAthlete: AthleteInputState;
    athleteDispatch: Dispatch<AthleteAction>;
};

export default function AthleteParams(props: Props) {
    const { athlete, originalAthlete, athleteDispatch } = props;
    const hasRiderMassChanged = athlete.riderMass !== originalAthlete.riderMass;
    const hasBikeMassChanged = athlete.bikeMass !== originalAthlete.bikeMass;
    const hasOtherMassChanged = athlete.otherMass !== originalAthlete.otherMass;
    const hasTotalMassChanged = athlete.totalMass !== originalAthlete.totalMass;
    const hasCPChanged = athlete.cp !== originalAthlete.cp;
    const hasWPrimeChanged = athlete.wPrime !== originalAthlete.wPrime;
    const hasAthleteChanged =
        hasRiderMassChanged ||
        hasBikeMassChanged ||
        hasOtherMassChanged ||
        hasCPChanged ||
        hasWPrimeChanged;

    const handleRiderMassChange = (event: ChangeEvent<HTMLInputElement>) => {
        athleteDispatch({
            type: 'setRiderMass',
            riderMass: event.target.value,
        });
    };

    const handleBikeMassChange = (event: ChangeEvent<HTMLInputElement>) => {
        athleteDispatch({ type: 'setBikeMass', bikeMass: event.target.value });
    };

    const handleOtherMassChange = (event: ChangeEvent<HTMLInputElement>) => {
        athleteDispatch({
            type: 'setOtherMass',
            otherMass: event.target.value,
        });
    };

    const handleCPChange = (event: ChangeEvent<HTMLInputElement>) => {
        athleteDispatch({ type: 'setCP', cp: event.target.value });
    };

    const handleWPrimeChange = (event: ChangeEvent<HTMLInputElement>) => {
        athleteDispatch({ type: 'setWPrime', wPrime: event.target.value });
    };

    const handleAthleteRestore = () => {
        athleteDispatch({ type: 'reset' });
    };

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
                <Paper
                    elevation={3}
                    sx={{
                        minWidth: 250,
                        height: 350,
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                        }}
                    >
                        <Typography variant="h6">Athlete Parameters</Typography>
                        <Tooltip title="Restore">
                            <IconButton
                                onClick={handleAthleteRestore}
                                disabled={!hasAthleteChanged}
                            >
                                <RestoreIcon />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <CustomTextField
                        label="Rider Mass"
                        value={athlete.riderMass}
                        onChange={handleRiderMassChange}
                        hasChanged={hasRiderMassChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.1',
                            min: 0,
                        }}
                        tool_title="The mass of the rider"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Bike Mass"
                        value={athlete.bikeMass}
                        onChange={handleBikeMassChange}
                        hasChanged={hasBikeMassChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.1',
                            min: 0,
                        }}
                        tool_title="The mass of the bicycle"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Other Mass"
                        value={athlete.otherMass}
                        onChange={handleOtherMassChange}
                        hasChanged={hasOtherMassChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.1',
                            min: 0,
                        }}
                        tool_title="Other mass - clothing, helmet etc."
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Total Mass"
                        value={athlete.totalMass}
                        hasChanged={hasTotalMassChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg
                                </InputAdornment>
                            ),
                            disabled: true,
                        }}
                        tool_title="Total mass calculated from previous mass inputs"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="CP"
                        value={athlete.cp}
                        onChange={handleCPChange}
                        hasChanged={hasCPChanged}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    W
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '1',
                            min: 0,
                        }}
                        tool_title="Power level sustainable for 1 hour in steady state"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="W'"
                        value={athlete.wPrime}
                        onChange={handleWPrimeChange}
                        hasChanged={hasWPrimeChanged}
                        tool_title="'over CP' energy reserve - assumes recovery function is 1 - Elite"
                        tool_position="bottom"
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    J
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '1',
                            min: 0,
                        }}
                    />
                </Paper>
            </Box>
        </div>
    );
}

function CustomTextField({
    tool_title,
    tool_position,
    hasChanged,
    label,
    ...textFieldProps
}:
    | (TextFieldProps & {
          hasChanged: boolean;
      })
    | any) {
    return (
        <Tooltip title={tool_title} placement={tool_position}>
            <TextField
                variant="standard"
                type="number"
                color={hasChanged ? 'warning' : 'primary'}
                label={label + (hasChanged ? ' (changed)' : '')}
                fullWidth
                sx={{
                    '& label': {
                        ...(hasChanged && { color: '#ed6c02' }),
                    },
                }}
                {...textFieldProps}
            />
        </Tooltip>
    );
}
