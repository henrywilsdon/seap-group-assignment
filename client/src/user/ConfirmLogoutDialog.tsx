import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogProps,
    DialogTitle,
} from '@mui/material';
import React from 'react';

type Props = DialogProps & {
    onClose: () => void;
    onConfirm: () => void;
};

export default function ConfirmLogoutDialog({ onConfirm, ...props }: Props) {
    return (
        <Dialog {...props}>
            <DialogTitle>Logout?</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    Are you sure you want to logout?
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose}>Cancel</Button>
                <Button onClick={onConfirm} autoFocus>
                    Logout
                </Button>
            </DialogActions>
        </Dialog>
    );
}
