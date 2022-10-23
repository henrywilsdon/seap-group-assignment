import {
    Paper,
    Box,
    Typography,
    Grid,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    SelectChangeEvent,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { PredictionOutput } from './PredictionsAPI';

type Props = {
    predict: PredictionOutput;
};

export default function SplitMetrics(props: Props) {
    const { predict } = props;
    const [selectedSegment, setSelectedSegment] = useState<number>(0);
    const handleSelectedSegmentChange = (event: SelectChangeEvent<number>) => {
        const value = event.target.value;
        const newId = typeof value === 'string' ? parseInt(value) : value;
        setSelectedSegment(newId);
    };
    const renderSegmentOptions = () => {
        return predict.segments.map((a, i) => (
            <MenuItem value={i}>{i + 1}</MenuItem>
        ));
    };

    return (
        <div className="SplitMetrics">
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                    width: 900,
                }}
            >
                <Paper elevation={3}>
                    <Grid
                        container
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                        columns={4}
                    >
                        <Grid item xs={2}>
                            <Typography variant="h6">Split Metrics</Typography>
                        </Grid>

                        <Grid item xs={2}>
                            <FormControl>
                                <InputLabel id="Segment">
                                    Select Segment
                                </InputLabel>
                                <Select
                                    labelId="Segment"
                                    value={selectedSegment}
                                    label="Select Segment"
                                    onChange={handleSelectedSegmentChange}
                                    size="small"
                                    variant="standard"
                                    sx={{
                                        width: '125px',
                                    }}
                                >
                                    {renderSegmentOptions()}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={1}>
                            Total Time:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {getPrettyTime(predict.full_course_data.duration)}
                        </Grid>
                        <Grid item xs={1}>
                            Segment Time:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {getPrettyTime(
                                predict.segments[selectedSegment].duration,
                            )}
                        </Grid>
                        <Grid item xs={1}>
                            Total Distance:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(predict.full_course_data.distance).toFixed(
                                2,
                            )}{' '}
                            m
                        </Grid>
                        <Grid item xs={1}>
                            Segment Distance:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(
                                predict.segments.at(selectedSegment)?.distance,
                            ).toFixed(2)}{' '}
                            m
                        </Grid>
                        <Grid item xs={1}>
                            Total Power:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(predict.full_course_data.power_in).toFixed(
                                2,
                            )}{' '}
                            W
                        </Grid>
                        <Grid item xs={1}>
                            Segment Power:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(
                                predict.segments.at(selectedSegment)?.power_in,
                            ).toFixed(2)}{' '}
                            W
                        </Grid>
                        <Grid item xs={1}>
                            Total Average Yaw:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(
                                predict.full_course_data.average_yaw,
                            ).toFixed(5)}{' '}
                            &deg;
                        </Grid>
                        <Grid item xs={1}>
                            Segment Average Yaw:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(
                                predict.segments.at(selectedSegment)
                                    ?.average_yaw,
                            ).toFixed(5)}{' '}
                            &deg;
                        </Grid>
                        <Grid item xs={1}>
                            Average Yaw per 40km:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.average_yaw_above_40kmh}{' '}
                            &deg;
                        </Grid>
                        <Grid item xs={1}>
                            Average Yaw per 40km:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {Number(
                                predict.segments.at(selectedSegment)
                                    ?.average_yaw_above_40kmh,
                            )}{' '}
                            &deg;
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
}
function getPrettyTime(totalSeconds: number) {
    const totalMinutes = totalSeconds / 60;
    const totalHours = totalMinutes / 60;

    const hours = Math.floor(totalHours);
    const minutes = Math.floor(totalMinutes % 60);
    const seconds = Math.floor(totalSeconds % 60);
    let dec = '';
    if (totalSeconds % 1 !== 0) {
        dec = '.5';
    }
    return (
        String(hours).padStart(2, '0') +
        ':' +
        String(minutes).padStart(2, '0') +
        ':' +
        String(seconds).padStart(2, '0') +
        dec
    );
}
