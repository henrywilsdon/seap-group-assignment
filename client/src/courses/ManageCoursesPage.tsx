import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import AthleteFormDialog from './AthleteFormDialog';

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
    gps_data?: any;
};

/** Sample course data for demonstration purpose */
const sampleData: CourseData[] = [
    {
        id: 1,
        name: 'Course A',
        location: 'Tokyo Racecourse A',
        last_updated: new Date(),
    },
    {
        id: 2,
        name: 'Course B',
        location: 'Tokyo Racecourse B',
        last_updated: new Date(),
    },
    {
        id: 3,
        name: 'Course C',
        location: 'Tokyo Racecourse C',
        last_updated: new Date(),
    },
];

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
    // By now, pre-populate with sample data
    const [data, setData] = React.useState(sampleData);

    // Composing the Manage Athletes page:
    //  An instance of AthleteFormDialog
    //  A button to add athlete
    //  A table to list athletes
    //  Each athlete in the table has buttons to Edit and Remove
    return (
        <Box sx={{ m: 2 }}>
            <Button variant="contained">+ Create</Button>

            {/* The athletes table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Athletes table">
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
                                        '&:last-child td, &:last-child th': {
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
                                        <Button>Remove</Button>
                                        <Button>Edit</Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
