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
    CourseParamsAction,
    CourseParamsInputState,
} from './useCourseParamsReducer';

type Props = {
    courseParams: CourseParamsInputState;
    courseParamsDispatch: Dispatch<CourseParamsAction>;
};

export default function CourseParams(props: Props) {
    const { courseParams, courseParamsDispatch } = props;

    const handleMinSlopeThresholdChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        courseParamsDispatch({
            type: 'setMinSlopeThreshold',
            minSlopeThreshold: event.target.value,
        });
    };

    const handleMaxSlopeThresholdChange = (
        event: ChangeEvent<HTMLInputElement>,
    ) => {
        courseParamsDispatch({
            type: 'setMaxSlopeThreshold',
            maxSlopeThreshold: event.target.value,
        });
    };

    const handleCourseParamsClear = () => {
        courseParamsDispatch({ type: 'clear' });
    };

    return (
        <div className="CourseParams">
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
                        <Typography variant="h6">Course Parameters</Typography>
                        <Tooltip title="Clear Values">
                            <IconButton onClick={handleCourseParamsClear}>
                                <Clear />
                            </IconButton>
                        </Tooltip>
                    </Box>

                    <CustomTextField
                        label="Minimum Slope Threshold"
                        value={courseParams.minSlopeThreshold}
                        onChange={handleMinSlopeThresholdChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    %
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.01',
                            min: -100,
                            max: 100,
                        }}
                        tool_title="Slope threshold below which rider comes off steady state power"
                        tool_position="bottom"
                    />

                    <CustomTextField
                        label="Maximum Slope Threshold"
                        value={courseParams.maxSlopeThreshold}
                        onChange={handleMaxSlopeThresholdChange}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    %
                                </InputAdornment>
                            ),
                        }}
                        inputProps={{
                            step: '0.01',
                            min: -100,
                            max: 100,
                        }}
                        tool_title="Slope threshold above which rider goes over steady state power"
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
