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
                        inputProps={{
                            step: '0.1',
                        }}
                        value={mechanical.crrValue}
                        onChange={handleCrrChange}
                        tool_title="Tyre rolling resistance coefficient"
                        tool_position="bottom"
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
                        tool_title="Reflects power lost in mechanical friction"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Mol Wheel Front"
                        value={mechanical.molWhlFront}
                        onChange={handleMolWhlFrontChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <p>
                                        kg.m<sup>2</sup>
                                    </p>
                                </InputAdornment>
                            ),
                        }}
                        tool_title="Moment of Inertia - Front Wheel"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Mol Wheel Rear"
                        value={mechanical.molWhlRear}
                        onChange={handleMolWhlRearChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <p>
                                        kg.m<sup>2</sup>
                                    </p>
                                </InputAdornment>
                            ),
                        }}
                        tool_title="Moment of Inertia - Rear Wheel"
                        tool_position="bottom"
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
                        tool_title="Radius of the wheels"
                        tool_position="bottom"
                    />
                </Paper>
            </Box>
        </div>
    );
}

function CustomTextField({
    tool_position,
    tool_title,
    label,
    ...textFieldProps
}: (TextFieldProps & {}) | any) {
    return (
        <Tooltip title={tool_title} placement={tool_position}>
            <TextField
                variant="standard"
                type="number"
                label={label}
                fullWidth
                {...textFieldProps}
            />
        </Tooltip>
    );
}
