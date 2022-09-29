import { Paper, Box, Typography } from '@mui/material';

function HandleOutputPredictionsUI() {
    return (
        <div className="HandleOutputPredictionsUI">
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Paper elevation={3}>
                    <Typography variant="h6">
                        PUT PREDICTIONS GRAPHS HERE
                    </Typography>
                </Paper>
            </Box>
        </div>
    );
}

export default HandleOutputPredictionsUI;
