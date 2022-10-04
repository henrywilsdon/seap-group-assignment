import { Paper, Box, TextField, Typography } from '@mui/material';

function AthleteParams() {
    return (
        <div className="AthleteParams">
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
                        Edit Athlete Parameters
                    </Typography>

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Rider Mass"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Bike Mass"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Other Mass"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="FTP"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="W'"
                        fullWidth
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default AthleteParams;
