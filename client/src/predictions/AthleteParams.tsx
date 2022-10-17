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
                    />

                    <CustomTextField
                        label="FTP"
                        value={athlete.cp}
                        onChange={handleCPChange}
                        hasChanged={hasCPChanged}
                    />

                    <CustomTextField
                        label="W'"
                        value={athlete.wPrime}
                        onChange={handleWPrimeChange}
                        hasChanged={hasWPrimeChanged}
                    />
                </Paper>
            </Box>
        </div>
    );
}

function CustomTextField({
    hasChanged,
    label,
    ...textFieldProps
}: TextFieldProps & {
    hasChanged: boolean;
}) {
    return (
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
    );
}
