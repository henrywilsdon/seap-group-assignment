import { Paper, Box, Typography } from '@mui/material';

function HandleCourseMap() {
    return (
        <div className="HandleCourseMap">
            <Box
                sx={{
                    display: 'flex',
                    '& > :not(style)': {
                        p: 1,
                    },
                }}
            >
                <Paper elevation={3}>
                    <Typography variant="h6">PUT COURSE MAP HERE</Typography>
                </Paper>
            </Box>
        </div>
    );
}

export default HandleCourseMap;
