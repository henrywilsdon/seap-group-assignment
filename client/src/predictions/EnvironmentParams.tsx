import { Paper, Box, TextField, Typography } from '@mui/material';

function EnvironmentParams() {
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
                    <Typography variant="h6">
                        Edit Environment Parameters
                    </Typography>

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Wind Direction"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Headwind"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Wind Speed"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Air Density"
                        fullWidth
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default EnvironmentParams;
