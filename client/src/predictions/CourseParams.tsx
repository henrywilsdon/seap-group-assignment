import { Paper, Box, TextField, Typography } from '@mui/material';

function CourseParams() {
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
                    <Typography variant="h6">
                        Edit Environment Parameters
                    </Typography>

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Slope Threshold Minimum"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Slope Threshold Maximum"
                        fullWidth
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default CourseParams;
