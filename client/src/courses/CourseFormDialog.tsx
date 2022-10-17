import React, { ChangeEvent } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, Grid, Stack, TextField, Typography } from '@mui/material';
import { CourseData } from './ManageCoursesPage';

/**
SegmentData
*/
export type SegmentData = {
    no: number;
    distance: number;
    elevation: number;
    roughness: number;
};

/** Sample course data for demonstration purpose */
const sampleSegmentsData: SegmentData[] = [
    {
        no: 1,
        distance: 100,
        elevation: 95,
        roughness: 1,
    },
    {
        no: 2,
        distance: 45,
        elevation: 0,
        roughness: 2,
    },
    {
        no: 3,
        distance: 100,
        elevation: 95,
        roughness: 1,
    },
];

type Props = {
    open: boolean;
    removal?: boolean;
    courseData?: CourseData;
    onCancel: () => void;
    onSave: (courseData: CourseData) => void;
};

/**
 * Create a Dialog for adding/editing a course data.
 * @param param0.open Set true/false to show/hide the dialog
 * @param param0.removal Set true to show dialog for removal confirmation
 * @param param0.athleteData The current athlete data to edit
 * @param param0.onCancel Callback when user hits "cancel", used by the caller to hide this dialog
 * @param param0.onSave Callback when user hits "Save" button, used by the caller to update the athlete data
 */
export default function CourseFormDialog({
    open,
    removal,
    courseData,
    onCancel,
    onSave,
}: Props) {
    // Manage a list of segments
    // By now, pre-populate with sample data
    const [segments, setSegments] = React.useState(sampleSegmentsData);

    // State for the GPX file
    const [gpxFile, setGpxFile] = React.useState<File | null>(null);

    // Handle change on the GPX File input
    const handleGpxFIleChange = (event: ChangeEvent) => {
        const target = event.target as HTMLInputElement;
        if (target.files) {
            const files = Array.from(target.files);
            const [file] = files;
            setGpxFile(file);
        } else {
            setGpxFile(null);
        }
    };

    // Managed state for all input fields for course data
    const [name, setName] = React.useState('');
    const [location, setLocation] = React.useState('');

    // Update the form to show the given course data
    React.useEffect(() => {
        setName((courseData && courseData.name) || '');
        setLocation((courseData && courseData.location) || '');
    }, [courseData]);

    // Handle Save button to call "onSave" with the edited data
    const handleSave = () =>
        onSave({
            name,
            location,
        });

    if (removal) {
        return (
            <Dialog fullWidth open={open} onClose={onCancel}>
                <DialogTitle>Remove Course</DialogTitle>
                <DialogContent>
                    <Box>
                        <TextField
                            required
                            margin="dense"
                            fullWidth
                            label="Course Name"
                            value={name}
                            onChange={(evt) => setName(evt.target.value)}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={onCancel}>Cancel</Button>
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="error"
                    >
                        Remove
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }

    return (
        <Dialog fullWidth maxWidth={false} open={open} onClose={onCancel}>
            <DialogTitle>
                {
                    // Title: New/Edit Course
                    courseData && courseData.id ? 'Edit' : 'New'
                }{' '}
                Course
            </DialogTitle>
            <DialogContent>
                <Box sx={{ padding: '1em' }}>
                    <Grid container spacing={2}>
                        <Grid item lg={8} xs={12}>
                            <Stack spacing={2}>
                                <Grid container component="form" spacing={2}>
                                    <Grid item sm={6}>
                                        <TextField
                                            required
                                            margin="dense"
                                            fullWidth
                                            label="Course Name"
                                            value={name}
                                            onChange={(evt) =>
                                                setName(evt.target.value)
                                            }
                                        />
                                    </Grid>
                                    <Grid item sm={6}>
                                        <TextField
                                            margin="dense"
                                            fullWidth
                                            label="GPX File"
                                            value={gpxFile?.name || ''}
                                            InputProps={{
                                                readOnly: true,
                                                endAdornment: (
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                    >
                                                        Browse
                                                        <input
                                                            type="file"
                                                            hidden
                                                            onChange={
                                                                handleGpxFIleChange
                                                            }
                                                        />
                                                        <input
                                                            hidden
                                                            accept="image/*"
                                                            multiple
                                                            type="file"
                                                        />
                                                    </Button>
                                                ),
                                            }}
                                        />
                                    </Grid>
                                    <Grid item sm={12}>
                                        <TextField
                                            required
                                            margin="dense"
                                            fullWidth
                                            label="Location / Address"
                                            value={location}
                                            onChange={(evt) =>
                                                setLocation(evt.target.value)
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        minHeight: '25rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    Google Maps
                                </Paper>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        minHeight: '15rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    Course Height Map
                                </Paper>
                            </Stack>
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <Typography variant="h6">Segments</Typography>
                            <TableContainer component={Paper}>
                                <Table aria-label="Segment table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>No.</TableCell>
                                            <TableCell align="right">
                                                Distance
                                            </TableCell>
                                            <TableCell align="right">
                                                Elev Chng
                                            </TableCell>
                                            <TableCell align="right">
                                                Roughness
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {segments.map((row) => (
                                            <TableRow
                                                key={row.no}
                                                sx={{
                                                    '&:last-child td, &:last-child th':
                                                        { border: 0 },
                                                }}
                                            >
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    {row.no}.
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.distance} km
                                                </TableCell>
                                                <TableCell align="right">
                                                    {row.elevation} m
                                                </TableCell>
                                                <TableCell
                                                    sx={{ width: '1rem' }}
                                                >
                                                    <TextField
                                                        type="number"
                                                        size="small"
                                                        value={row.roughness}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                <Button
                    onClick={handleSave}
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    );
}
