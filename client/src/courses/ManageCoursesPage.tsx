import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { useEffect, useState } from 'react';
import {
    BackendGpsPoints,
    createCourse,
    deleteCourse,
    getAllCourses,
    updateCourse,
} from './CourseApi';
import CourseFormDialog from './CourseFormDialog';

/**
Course

name
  Type: string
  Description: Name given by user to identify course

location
  Type: unknown
  Description: Maybe the starting GPS coords or an address

last_updated
  Type: datetime
  Description: Date and time of the last time the course was changed or created

gps_data
  Type: unknown
  Description: The GPS data for the course
*/
export type CourseData = {
    /** Course ID, shall come from database */
    id?: number;
    /** Course's name */
    name?: string;
    /** Location, e.g. GPS coords or an address */
    location?: string;
    /** Date and time of the last time the course was changed or created */
    last_updated?: Date;
    /** The GPS data for the course */
    gps_data?: BackendGpsPoints;
};

type Props = {};

/**
 * Create the page for managing course data. This page contains a table
 * that list all courses, a button to add new course, and allowing
 * editing/removing each course.
 * @param param0 no special props needed
 * @returns
 */
export default function ManageCoursesPage({}: Props) {
    // Manage a list of all courses
    const [data, setData] = useState<CourseData[]>([]);

    const [backendChanged, setBackendChanged] = useState(0);

    // Manage states for CourseFormDialog to add/edit/remove course:
    // open: whether to show/hide the course dialog
    const [openCourseDialog, setOpenCourseDialog] = useState(false);
    // removal: whether to show the course dialog for removal confirmation
    const [courseDialogRemoval, setCourseDialogRemoval] = useState(false);
    // editingAthlete: data of the course chosen from the course table
    const [editingCourse, setEditingCourse] = useState<CourseData>({});

    // Fetch courses data from the backend
    useEffect(() => {
        getAllCourses()
            .then((courses) => setData(courses))
            .catch((error: Error) => {
                alert('Error loading courses: ' + error.message);
            });
    }, [backendChanged]);

    // Call to show the dialog for adding new course
    const onNewCourse = () => {
        setEditingCourse({});
        setOpenCourseDialog(true);
        setCourseDialogRemoval(false);
    };

    // Call to show the dialog for editing the given course
    const onEditCourse = (courseData: CourseData) => {
        setEditingCourse(courseData);
        setOpenCourseDialog(true);
        setCourseDialogRemoval(false);
    };

    // Call to show the dialog for removing the given course
    const onRemoveCourse = (courseData: CourseData) => {
        setEditingCourse(courseData);
        setOpenCourseDialog(true);
        setCourseDialogRemoval(true);
    };

    // Call to hide the course dialog
    const handleCreateCourseClose = () => {
        setEditingCourse({});
        setOpenCourseDialog(false);
    };

    // Callback for "Save" button on the course dialog to perform the
    // corresponding action
    const handleCreateCourseSave = (courseData: CourseData) => {
        if (courseDialogRemoval) {
            // Remove the course by calling the back-end API
            console.log(`Remove course ${editingCourse.id}`);
            deleteCourse(editingCourse.id)
                .then(() => {
                    console.log(`Course ${editingCourse.id} deleted`);
                    setBackendChanged(Date.now());
                })
                .catch((error: Error) => {
                    alert('Error removing course: ' + error.message);
                });
        } else if (editingCourse.id) {
            // Update the corresponding course by calling the back-end API
            console.log(`Edit course ${editingCourse.id}`, editingCourse);
            updateCourse(editingCourse.id, courseData)
                .then(() => {
                    console.log(`Course ${editingCourse.id} updated`);
                    setBackendChanged(Date.now());
                })
                .catch((error: Error) => {
                    alert('Error updating course: ' + error.message);
                });
        } else {
            // Create new course by calling the back-end API
            console.log(`New course`, courseData);
            createCourse(courseData)
                .then(() => {
                    console.log(`Course ${editingCourse.id} created`);
                    setBackendChanged(Date.now());
                })
                .catch((error: Error) => {
                    alert('Error creating course: ' + error.message);
                });
        }
        setOpenCourseDialog(false);
    };

    // Composing the Manage Courses page:
    //  An instance of CourseFormDialog
    //  A button to add course
    //  A table to list courses
    //  Each course in the table has buttons to Edit and Remove
    return (
        <>
            <CourseFormDialog
                courseData={editingCourse}
                open={openCourseDialog}
                removal={courseDialogRemoval}
                onSave={handleCreateCourseSave}
                onCancel={handleCreateCourseClose}
                isEditing={typeof editingCourse?.id === 'number'}
            />
            <Box sx={{ m: 2 }}>
                {/* Title box */}
                <Box
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h4">Courses</Typography>
                </Box>

                <Button variant="contained" onClick={onNewCourse}>
                    + Create
                </Button>

                {/* The Courses table */}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 650 }} aria-label="Courses table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align="right">Location</TableCell>
                                <TableCell align="right">Updated</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {
                                // List all athletes: name, rider mass, bike mass, other mass,
                                // total mass (sum of rider mass, bike mass, and other mass),
                                // CP/FTP, and W'
                                data.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        sx={{
                                            '&:last-child td, &:last-child th':
                                                {
                                                    border: 0,
                                                },
                                        }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {row.name}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.location}
                                        </TableCell>
                                        <TableCell align="right">
                                            {row.last_updated?.toLocaleDateString()}{' '}
                                            {row.last_updated?.toLocaleTimeString()}
                                        </TableCell>
                                        {/* Button to Remove / Edit course */}
                                        <TableCell>
                                            <Button
                                                onClick={() =>
                                                    onRemoveCourse(row)
                                                }
                                            >
                                                Remove
                                            </Button>
                                            <Button
                                                onClick={() =>
                                                    onEditCourse(row)
                                                }
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            }
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
}
