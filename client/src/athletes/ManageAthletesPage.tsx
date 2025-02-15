import { Add as AddIcon, Refresh as RefreshIcon } from '@mui/icons-material';
import { Button, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import React from 'react';
import useOnLoad from '../common/useOnLoad';
import AthleteFormDialog from './AthleteFormDialog';
import {
    AthleteData,
    createAthlete,
    deleteAthlete,
    getAthletes,
    updateAthlete,
} from './athletesAPI';

const createEmptyAthlete = (): AthleteData => ({
    fullName: '',
    riderMass: 0,
    bikeMass: 0,
    otherMass: 0,
    cp: 0,
    wPrime: 0,
});

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
    const [data, setData] = React.useState<AthleteData[]>([]);

    // Manage states for AthleteFormDialog to add/edit/remove athlete:
    // open: whether to show/hide the athlete dialog
    const [open, setOpen] = React.useState(false);
    // removal: whether to show the athlete dialog for removal confirmation
    const [removal, setRemoval] = React.useState(false);
    // editingAthlete: data of the athlete chosen from the athlete table
    const [editingAthlete, setEditingAthlete] =
        React.useState<AthleteData>(createEmptyAthlete);
    const [editingAthleteError, setEditingAthleteError] = React.useState('');

    useOnLoad(() => {
        refreshAthletes();
    });

    const refreshAthletes = () => {
        getAthletes().then(setData).catch(console.error);
    };

    // Call to show the dialog for adding new athlete
    const onNewAthlete = () => {
        setEditingAthlete(createEmptyAthlete());
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
        setEditingAthleteError('');
        if (removal) {
            if (typeof editingAthlete.id !== 'number') {
                return;
            }
            // For removal: remove the athlete from the athlete list
            console.log(`Remove athlete ${editingAthlete.id}`);
            deleteAthlete(editingAthlete?.id)
                .then(() => {
                    refreshAthletes();
                    setOpen(false); // Hide the athlete dialog
                })
                .catch((error) => {
                    setEditingAthleteError(error?.message);
                });
        } else if (editingAthlete.id) {
            // For editing: update the corresponding athlete in the athlete list
            console.log(`Edit athlete ${editingAthlete.id}`, athleteData);

            updateAthlete(editingAthlete.id, athleteData)
                .then(() => {
                    refreshAthletes();
                    setOpen(false); // Hide the athlete dialog
                })
                .catch((error) => {
                    setEditingAthleteError(error?.message);
                });
        } else {
            // For adding: create new athlete and add to the athlete list
            console.log(`New athlete`, athleteData);

            createAthlete(athleteData)
                .then((newId) => {
                    refreshAthletes();
                    setOpen(false); // Hide the athlete dialog
                })
                .catch((error) => {
                    setEditingAthleteError(error?.message);
                });
        }
    };

    // Composing the Manage Athletes page:
    //  An instance of AthleteFormDialog
    //  A button to add athlete
    //  A table to list athletes
    //  Each athlete in the table has buttons to Edit and Remove
    return (
        <Box sx={{ m: 2 }}>
            {/* Title box */}
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography variant="h4">Athletes</Typography>
            </Box>

            {/* The athlete dialog */}
            <AthleteFormDialog
                athleteData={editingAthlete}
                open={open}
                removal={removal}
                onSave={onEditSave}
                onCancel={onCancel}
                error={editingAthleteError}
            />

            <Box sx={{ mb: 2 }}>
                <Button
                    onClick={onNewAthlete}
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mr: 2 }}
                >
                    Create
                </Button>

                <Button onClick={refreshAthletes} startIcon={<RefreshIcon />}>
                    Refresh
                </Button>
            </Box>

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
                                        {row.fullName}
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
