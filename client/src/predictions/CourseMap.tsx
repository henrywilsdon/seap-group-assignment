import { Paper, Box, Typography } from '@mui/material';

function CourseMap() {
    return (
        <div className="CourseMap">
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

export default CourseMap;
