import { Paper, Box, TextField, Typography } from '@mui/material';

function MechanicalParams() {
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
                    <Typography variant="h6">
                        Edit Mechanical Parameters
                    </Typography>

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Crr"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Mechanical Efficiency"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Mol Whl Front"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Mol Whl Rear"
                        fullWidth
                    />

                    <TextField
                        color="primary"
                        variant="standard"
                        label="Wheel Radius"
                        fullWidth
                    />
                </Paper>
            </Box>
        </div>
    );
}

export default MechanicalParams;
