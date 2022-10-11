import { Clear } from '@mui/icons-material';
import {
    Paper,
    Box,
    TextField,
    Typography,
    TextFieldProps,
    InputAdornment,
    Tooltip,
    IconButton,
} from '@mui/material';
import { ChangeEvent, Dispatch } from 'react';
import { MechanicalAction, MechanicalInputState } from './useMechanicalReducer';

type Props = {
    mechanical: MechanicalInputState;
    mechanicalDispatch: Dispatch<MechanicalAction>;
};

export default function MechanicalParams(props: Props) {
    const { mechanical, mechanicalDispatch } = props;

    const handleCrrChange = (event: ChangeEvent<HTMLInputElement>) => {
        mechanicalDispatch({
            type: 'setCrr',
            crrValue: event.target.value,
        });
    };

    const handleMechEfficiencyChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        mechanicalDispatch({
            type: 'setMechEfficiency',
            mechEfficiency: event.target.value,
        });
    };

    const handleMolWhlFrontChange = (event: ChangeEvent<HTMLInputElement>) => {
        mechanicalDispatch({
            type: 'setMolWhlFront',
            molWhlFront: event.target.value,
        });
    };

    const handleMolWhlRearChange = (event: ChangeEvent<HTMLInputElement>) => {
        mechanicalDispatch({
            type: 'setMolWhlRear',
            molWhlRear: event.target.value,
        });
    };

    const handleWheelRadiusChange = (event: ChangeEvent<HTMLInputElement>) => {
        mechanicalDispatch({
            type: 'setWheelRadius',
            wheelRadius: event.target.value,
        });
    };

    const handleMechanicalClear = () => {
        mechanicalDispatch({ type: 'clear' });
    };

    return (
        <div className="MechanicalParams">
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
                        alignItems: 'center',
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
                        <Typography variant="h6">
                            Mechanical Parameters
                        </Typography>
                        <Tooltip title="Clear Values">
                            <IconButton onClick={handleMechanicalClear}>
                                <Clear />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <CustomTextField
                        label="Crr"
                        value={mechanical.crrValue}
                        onChange={handleCrrChange}
                    />

                    <CustomTextField
                        label="Mechanical Efficiency"
                        value={mechanical.mechEfficiency}
                        onChange={handleMechEfficiencyChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    %
                                </InputAdornment>
                            ),
                        }}
                    />

                    <CustomTextField
                        label="Mol Wheel Front"
                        value={mechanical.molWhlFront}
                        onChange={handleMolWhlFrontChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg.m^2
                                </InputAdornment>
                            ),
                        }}
                    />

                    <CustomTextField
                        label="Mol Wheel Rear"
                        value={mechanical.molWhlRear}
                        onChange={handleMolWhlRearChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    kg.m^2
                                </InputAdornment>
                            ),
                        }}
                    />

                    <CustomTextField
                        label="Wheel Radius"
                        value={mechanical.wheelRadius}
                        onChange={handleWheelRadiusChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    m
                                </InputAdornment>
                            ),
                        }}
                    />
                </Paper>
            </Box>
        </div>
    );
}

function CustomTextField({ label, ...textFieldProps }: TextFieldProps & {}) {
    return (
        <TextField
            variant="standard"
            type="number"
            label={label}
            fullWidth
            {...textFieldProps}
        />
    );
}
