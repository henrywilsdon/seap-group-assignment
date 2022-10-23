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
import {
    EnvironmentAction,
    EnvironmentInputState,
} from './useEnvironmentReducer';

type Props = {
    environment: EnvironmentInputState;
    environmentDispatch: Dispatch<EnvironmentAction>;
};

export default function EnvironmentParams(props: Props) {
    const { environment, environmentDispatch } = props;

    const handleWindDirectionChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        environmentDispatch({
            type: 'setWindDirection',
            windDirection: event.target.value,
        });
    };

    const handleWindSpeedChange = (event: ChangeEvent<HTMLInputElement>) => {
        environmentDispatch({
            type: 'setWindSpeed',
            windSpeed: event.target.value,
        });
    };

    const handleAirDensityChange = (event: ChangeEvent<HTMLInputElement>) => {
        environmentDispatch({
            type: 'setAirDensity',
            airDensity: event.target.value,
        });
    };

    const handleEnvironmentClear = () => {
        environmentDispatch({ type: 'clear' });
    };

    return (
        <div className="EnvironmentParams">
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
                            Environment Parameters
                        </Typography>
                        <Tooltip title="Clear Values">
                            <IconButton onClick={handleEnvironmentClear}>
                                <Clear />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <CustomTextField
                        label="Wind Direction"
                        value={environment.windDirection}
                        onChange={handleWindDirectionChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    deg
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.1',
                        }}
                        tool_title="The expected wind direction"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Wind Speed"
                        value={environment.windSpeed}
                        onChange={handleWindSpeedChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    m/s
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.1',
                        }}
                        tool_title="The expected wind speed"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Air Density"
                        value={environment.airDensity}
                        onChange={handleAirDensityChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <p>
                                        kg/m<sup>3</sup>
                                    </p>
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.01',
                            min: 0,
                        }}
                        tool_title="Air density from user calculations"
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
