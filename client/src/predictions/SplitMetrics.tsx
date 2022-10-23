import { Paper, Box, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import { PredictionOutput } from './PredictionsAPI';

type Props = {
    predict: PredictionOutput;
};

export default function SplitMetrics(props: Props) {
    const { predict } = props;

    return (
        <div className="SplitMetrics">
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Paper elevation={3}>
                    <Typography variant="h6">Split Metrics</Typography>
                    <Grid
                        container
                        direction="row"
                        spacing={0.5}
                        justifyContent="center"
                        alignItems="center"
                        columns={4}
                    >
                        <Grid item xs={1}>
                            Total Time:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.duration}
                        </Grid>
                        <Grid item xs={1}>
                            Segment Time:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.segments.at(1)?.duration}
                        </Grid>
                        <Grid item xs={1}>
                            Total Distance:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.distance}
                        </Grid>
                        <Grid item xs={1}>
                            Segment Distance:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.segments.at(1)?.distance}
                        </Grid>
                        <Grid item xs={1}>
                            Total Power:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.power_in}
                        </Grid>
                        <Grid item xs={1}>
                            Segment Power:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.segments.at(1)?.power_in}
                        </Grid>
                        <Grid item xs={1}>
                            Total Average Yaw:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.average_yaw}
                        </Grid>
                        <Grid item xs={1}>
                            Segment Average Yaw:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.segments.at(1)?.average_yaw}
                        </Grid>
                        <Grid item xs={1}>
                            Average Yaw per 40km:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.full_course_data.average_yaw_above_40kmh}
                        </Grid>
                        <Grid item xs={1}>
                            Average Yaw per 40km:{' '}
                        </Grid>
                        <Grid item xs={1}>
                            {predict.segments.at(1)?.average_yaw_above_40kmh}
                        </Grid>
                    </Grid>
                </Paper>
            </Box>
        </div>
    );
}
