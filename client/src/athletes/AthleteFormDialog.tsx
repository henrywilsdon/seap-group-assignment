import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { DialogContentText, Grid, InputAdornment } from '@mui/material';
import { AthleteData } from './ManageAthletesPage';

type Props = {
    open: boolean;
    removal?: boolean;
    athleteData?: AthleteData;
    onCancel: () => void;
    onSave: (athleteData: AthleteData) => void;
};

/**
 * Create a Dialog for adding/editing/removing an athlete data.
 * @param param0.open Set true/false to show/hide the dialog
 * @param param0.removal Set true to show dialog for removal confirmation
 * @param param0.athleteData The current athlete data to edit
 * @param param0.onCancel Callback when user hits "cancel", used by the caller to hide this dialog
 * @param param0.onSave Callback when user hits "Save" button, used by the caller to update the athlete data
 */
export default function AthleteFormDialog({
    open,
    removal,
    athleteData,
    onCancel,
    onSave,
}: Props) {
    // Update the form to show the given athlete data
    React.useEffect(() => {
        setName((athleteData && athleteData.name) || '');
        setRiderMass((athleteData && athleteData.riderMass) || 0);
        setBikeMass((athleteData && athleteData.bikeMass) || 0);
        setOtherMass((athleteData && athleteData.otherMass) || 0);
        setCp((athleteData && athleteData.cp) || 0);
        setWPrime((athleteData && athleteData.wPrime) || 0);
    }, [athleteData]);

    // Managed state for all input fields for athlete's name,
    // rider mass, bike mass, other mass, CP/FTP, and W'
    const [name, setName] = React.useState('');
    const [riderMass, setRiderMass] = React.useState(0);
    const [bikeMass, setBikeMass] = React.useState(0);
    const [otherMass, setOtherMass] = React.useState(0);
    const [cp, setCp] = React.useState(0);
    const [wPrime, setWPrime] = React.useState(0);

    // Handle Save button to call "onSave" with the edited data
    const handleSave = () =>
        onSave({
            name,
            riderMass,
            bikeMass,
            otherMass,
            cp,
            wPrime,
        });

    return (
        <Dialog open={open} onClose={onCancel}>
            <DialogTitle>
                {
                    // Title: New/Edit/Remove Athlete
                    athleteData && athleteData.id
                        ? removal
                            ? 'Remove'
                            : 'Edit'
                        : 'New'
                }{' '}
                Athlete
            </DialogTitle>
            <DialogContent>
                {removal ? (
                    // For removal - show a message for confirmation
                    <DialogContentText>
                        Are you sure to remove athlete "{name}"?
                    </DialogContentText>
                ) : (
                    // For adding/editing, show the form for input athlete data
                    <Grid container spacing={2} component="form">
                        <Grid item md={6}>
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="Name"
                                value={name}
                                onChange={(evt) => setName(evt.target.value)}
                            />
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="Rider mass"
                                type="number"
                                value={riderMass}
                                onChange={(evt) =>
                                    setRiderMass(parseFloat(evt.target.value))
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kg
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="Bike mass"
                                type="number"
                                value={bikeMass}
                                onChange={(evt) =>
                                    setBikeMass(parseFloat(evt.target.value))
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kg
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="Other mass"
                                type="number"
                                value={otherMass}
                                onChange={(evt) =>
                                    setOtherMass(parseFloat(evt.target.value))
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            kg
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                        <Grid item md={6}>
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="CP/FTP"
                                type="number"
                                value={cp}
                                onChange={(evt) =>
                                    setCp(parseFloat(evt.target.value))
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            W
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                required
                                margin="dense"
                                fullWidth
                                label="W'"
                                type="number"
                                value={wPrime}
                                onChange={(evt) =>
                                    setWPrime(parseFloat(evt.target.value))
                                }
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            J
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Grid>
                    </Grid>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onCancel}>Cancel</Button>
                {removal ? (
                    // Show "Save" or "Remove" button
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="error"
                    >
                        Remove
                    </Button>
                ) : (
                    <Button
                        onClick={handleSave}
                        variant="contained"
                        color="primary"
                    >
                        Save
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
}
