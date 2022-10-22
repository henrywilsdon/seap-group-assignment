import { Close } from '@mui/icons-material';
import {
    Button,
    Grid,
    IconButton,
    Stack,
    TextField,
    Tooltip,
    Typography,
} from '@mui/material';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React, { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { Datum } from 'react-charts';
import { BackendGpsPoints, getCourse, parseGpx } from './CourseApi';
import CourseMap from './CourseMap';
import HeightMap from './HeightMap';
import { CourseData } from './ManageCoursesPage';
import { GpsPoint, useMapState } from './useMapState';

/**
SegmentData
*/
export type SegmentData = {
    no: number;
    distance: number;
    elevation: number;
    roughness: number;
};

type Props = {
    open: boolean;
    removal?: boolean;
    courseData?: CourseData;
    onCancel: () => void;
    onSave: (courseData: CourseData) => void;
    isEditing?: boolean;
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
    isEditing,
}: Props) {
    // Manage a list of segments
    const [segments, setSegments] = React.useState<SegmentData[]>([]);

    // State for the GPX file
    const [gpxFile, setGpxFile] = React.useState<File | null>(null);
    const [backendCourseGps, setBackendCourseGps] =
        useState<BackendGpsPoints | null>(null);

    const {
        points,
        splits,
        hoverPoint,
        hoverSplitIdx,
        boundsLatLng,
        setHoverPoint,
        addSplit,
        removeSplit,
        createBackendGpsPoints,
    } = useMapState(backendCourseGps);

    useEffect(() => {
        if (!open) {
            setBackendCourseGps(null);
            setGpxFile(null);
            return;
        }

        if (!gpxFile && isEditing && courseData?.id && courseData.id >= 0) {
            getCourse(courseData.id).then((_courseData) => {
                setBackendCourseGps(_courseData?.gps_data || null);
            });
        } else if (!gpxFile) {
            setBackendCourseGps(null);
        } else {
            parseGpx(gpxFile).then(setBackendCourseGps);
        }
    }, [open, gpxFile, isEditing, courseData]);

    useEffect(() => {
        if (points.length === 0) {
            setSegments([]);
            return;
        }

        const lastPointIdx = points.length > 0 ? points.length - 1 : 0;
        setSegments(
            [...splits, lastPointIdx].map((endPointIdx, splitIdx) => {
                const startPointIdx = splitIdx > 0 ? splits[splitIdx - 1] : 0;

                let distance = 0;
                const elevation =
                    points[endPointIdx].elev - points[startPointIdx].elev;
                for (let i = startPointIdx; i < endPointIdx; i++) {
                    distance += points[i].distance;
                }

                return {
                    no: splitIdx + 1,
                    distance: parseFloat((distance / 1000).toFixed(2)),
                    elevation: parseFloat(elevation.toFixed(1)),
                    roughness: 0,
                };
            }),
        );
    }, [points, splits]);

    const handleHeightMapClick = useCallback(
        (point: Datum<GpsPoint> | null) => {
            const newSplitPointIdx = point?.originalDatum?.idx || null;
            addSplit(newSplitPointIdx);
        },
        [addSplit],
    );

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
    const handleSave = () => {
        const gps_data = createBackendGpsPoints();
        if (!gps_data) {
            return;
        }
        onSave({
            name,
            location,
            gps_data,
        });
    };

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

    const renderSegments = () => {
        const handleRemoveSegment = (splitIdx: number) => {
            removeSplit(splitIdx);
        };

        return segments.map((seg) => (
            <TableRow
                key={seg.no}
                selected={hoverSplitIdx === seg.no - 1}
                sx={{
                    '&:last-child td, &:last-child th': {
                        border: 0,
                    },
                }}
            >
                <TableCell component="th" scope="row">
                    {seg.no}.
                </TableCell>
                <TableCell align="right">{seg.distance} km</TableCell>
                <TableCell align="right">{seg.elevation} m</TableCell>
                <TableCell sx={{ width: '1rem' }}>
                    <TextField
                        type="number"
                        size="small"
                        value={seg.roughness}
                    />
                </TableCell>
                <TableCell>
                    {splits.length > 0 && (
                        <Tooltip title="Remove segment end point">
                            <IconButton
                                onClick={() => handleRemoveSegment(seg.no - 1)}
                            >
                                <Close />
                            </IconButton>
                        </Tooltip>
                    )}
                </TableCell>
            </TableRow>
        ));
    };

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
                                        display: 'flex',
                                        flexDirection: 'column',
                                        minHeight: '25rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    <Box
                                        sx={{
                                            flexGrow: 1,
                                            flexDirection: 'column',
                                            display: 'flex',
                                            height: '100%',
                                        }}
                                    >
                                        <CourseMap
                                            points={points}
                                            splits={splits}
                                            hoverPoint={hoverPoint}
                                            hoverSplitIdx={hoverSplitIdx}
                                            bounds={boundsLatLng}
                                        />
                                    </Box>
                                </Paper>
                                <Paper
                                    elevation={2}
                                    sx={{
                                        display: 'flex',
                                        flexGrow: 1,
                                        flexDirection: 'column',
                                        minHeight: '15rem',
                                        textAlign: 'center',
                                    }}
                                >
                                    <HeightMap
                                        points={points}
                                        splits={splits}
                                        onHoverPointChange={setHoverPoint}
                                        onClick={handleHeightMapClick}
                                    />
                                </Paper>
                            </Stack>
                        </Grid>
                        <Grid item lg={4} xs={12}>
                            <Typography variant="h6">Segments</Typography>
                            <TableContainer component={Paper}>
                                <Table
                                    sx={{
                                        '& th,td': {
                                            pl: 2,
                                            pr: 1,
                                        },
                                    }}
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell width={1}>No.</TableCell>
                                            <TableCell align="right">
                                                Distance
                                            </TableCell>
                                            <TableCell align="right">
                                                Elev Chng
                                            </TableCell>
                                            <TableCell align="right">
                                                Roughness
                                            </TableCell>
                                            <TableCell></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>{renderSegments()}</TableBody>
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
