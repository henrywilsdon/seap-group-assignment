import { Paper, Box, Typography } from '@mui/material';

function HandleSplitMetrics() {
    return (
        <div className="HandleSplitMetrics">
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Paper elevation={3}>
                    <Typography variant="h6">PUT SPLIT METRICS HERE</Typography>
                </Paper>
            </Box>
        </div>
    );
}

export default HandleSplitMetrics;
