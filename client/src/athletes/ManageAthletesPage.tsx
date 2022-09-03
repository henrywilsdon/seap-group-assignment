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
 * Input data for an athlete
 */
export type AthleteData = {
    /** Identifying each athlete */
    id?: number;
    /** Athlete's name */
    name?: string;
    /** Rider's mass, in kg */
    riderMass?: number;
    /** Bike's mass, in kg */
    bikeMass?: number;
    /** Other mass, in kg */
    otherMass?: number;
    /** CP (or FTP), in W */
    cp?: number;
    /** W', in J */
    wPrime?: number;
};

/** Sample athlete data for demonstration purpose */
const sampleData: AthleteData[] = [
    {
        id: 1,
        name: 'Rider A',
        riderMass: 75,
        bikeMass: 12,
        otherMass: 1,
        cp: 430,
        wPrime: 35000,
    },
    {
        id: 2,
        name: 'Rider B',
        riderMass: 76,
        bikeMass: 13,
        otherMass: 2,
        cp: 440,
        wPrime: 36000,
    },
    {
        id: 3,
        name: 'Rider C',
        riderMass: 77,
        bikeMass: 14,
        otherMass: 3,
        cp: 450,
        wPrime: 37000,
    },
];

type Props = {};

/**
 * Create the page for managing athlete data. This page contains a table
 * that list all athletes, a button to add new athlete, and allowing
 * editing/removing each athlete.
 * @param param0 no special props needed
 * @returns
 */
export default function ManageAthletesPage({}: Props) {
    // Manage a list of all athletes
    // By now, pre-populate with sample data
    const [data, setData] = React.useState(sampleData);

    // Manage states for AthleteFormDialog to add/edit/remove athlete:
    // open: whether to show/hide the athlete dialog
    const [open, setOpen] = React.useState(false);
    // removal: whether to show the athlete dialog for removal confirmation
    const [removal, setRemoval] = React.useState(false);
    // editingAthlete: data of the athlete chosen from the athlete table
    const [editingAthlete, setEditingAthlete] = React.useState<AthleteData>({});

    // Call to show the dialog for adding new athlete
    const onNewAthlete = () => {
        setEditingAthlete({});
        setOpen(true);
        setRemoval(false);
    };
    // Call to show the dialog for editing the given athlete
    const onEditAthlete = (athleteData: AthleteData) => {
        setEditingAthlete(athleteData);
        setOpen(true);
        setRemoval(false);
    };
    // Call to show the dialog for removing the given athlete
    const onRemoveAthlete = (athleteData: AthleteData) => {
        setEditingAthlete(athleteData);
        setOpen(true);
        setRemoval(true);
    };
    // Call to hide the athlete dialog
    const onCancel = () => setOpen(false);

    // Callback for "Save" button on the athlete dialog to perform
    // the corresponding
    const onEditSave = (athleteData: AthleteData) => {
        if (removal) {
            // For removal: remove the athlete from the athlete list
            console.log(`Remove athlete ${editingAthlete.id}`);
            setData(data.filter((row) => row.id !== editingAthlete.id));
        } else if (editingAthlete.id) {
            // For editing: update the corresponding athlete in the athlete list
            console.log(`Edit athlete ${editingAthlete.id}`, athleteData);
            setData(
                data.map((row) =>
                    row.id === editingAthlete.id
                        ? { ...row, ...athleteData }
                        : row,
                ),
            );
        } else {
            // For adding: create new athlete and add to the athlete list
            console.log(`New athlete`, athleteData);
            const newAthlete = {
                // Generate ID in sequence (max id + 1)
                id: Math.max(...data.map((athlete) => athlete.id || 0)) + 1,
                ...athleteData,
            };
            setData([...data, newAthlete]);
        }
        setOpen(false); // Hide the athlete dialog
    };

    // Composing the Manage Athletes page:
    //  An instance of AthleteFormDialog
    //  A button to add athlete
    //  A table to list athletes
    //  Each athlete in the table has buttons to Edit and Remove
    return (
        <Box sx={{ m: 2 }}>
            {/* The athlete dialog */}
            <AthleteFormDialog
                athleteData={editingAthlete}
                open={open}
                removal={removal}
                onSave={onEditSave}
                onCancel={onCancel}
            />

            <Button onClick={onNewAthlete} variant="contained">
                + Create
            </Button>

            {/* The athletes table */}
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="Athletes table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell align="right">Rider Mass</TableCell>
                            <TableCell align="right">Bike Mass</TableCell>
                            <TableCell align="right">Rider Other</TableCell>
                            <TableCell align="right">Total Mass</TableCell>
                            <TableCell align="right">CP/FTP</TableCell>
                            <TableCell align="right">W'</TableCell>
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
                                        {row.riderMass}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.bikeMass}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.otherMass}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.riderMass != null &&
                                        row.bikeMass != null &&
                                        row.otherMass != null
                                            ? row.riderMass +
                                              row.bikeMass +
                                              row.otherMass
                                            : ''}
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.cp}W
                                    </TableCell>
                                    <TableCell align="right">
                                        {row.wPrime}J
                                    </TableCell>
                                    {/* Button to Remove / Edit athlete */}
                                    <TableCell>
                                        <Button
                                            onClick={() => onRemoveAthlete(row)}
                                        >
                                            Remove
                                        </Button>
                                        <Button
                                            onClick={() => onEditAthlete(row)}
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
    );
}
