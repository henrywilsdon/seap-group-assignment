import { Button, TextField, Tooltip, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import UserContext from '../user/UserContext';
import './ManageProfilePage.css';

type Props = {};

export default function ManageProfilePage({}: Props) {
    const { changeUserInfo } = useContext(UserContext);
    const { changePassword } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [email, setEmail] = useState('');

    //NAME
    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    const updateInfo = () => {
        changeUserInfo(username, email);
    };

    //EMAIL
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    };

    //PASSWORD
    const handleNewPassword = (event: any) => {
        setNewPassword(event.target.value);
    };

    const handleNewPassword2 = (event: any) => {
        setNewPassword2(event.target.value);
    };

    const handleCurrentPassword = (event: any) => {
        setCurrentPassword(event.target.value);
    };

    const updatePassword = () => {
        if (
            newPassword === newPassword2 &&
            newPassword != null &&
            newPassword != ''
        ) {
            changePassword(newPassword, currentPassword);
        } else if (newPassword != newPassword2) {
            alert('Passwords do not match.');
        } else {
            alert('Enter a valid password.');
        }
    };

    return (
        <div className="ManageProfilePage">
            <Typography variant="h4">Account Profile</Typography>

            <Tooltip title="Enter your new username" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Username"
                    value={username}
                    onChange={handleName}
                />
            </Tooltip>

            <Tooltip title="Enter your new email" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Email"
                    value={email}
                    onChange={handleEmail}
                />
            </Tooltip>

            <Button variant="text" onClick={updateInfo}>
                Update User Info
            </Button>

            <Tooltip title="Enter your current password" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="Current Password"
                    value={currentPassword}
                    onChange={handleCurrentPassword}
                />
            </Tooltip>

            <Tooltip title="Enter your new password" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Password"
                    value={newPassword}
                    onChange={handleNewPassword}
                />
            </Tooltip>

            <Tooltip
                title="Enter your new password again"
                placement="right-end"
            >
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Password"
                    value={newPassword2}
                    onChange={handleNewPassword2}
                />
            </Tooltip>

            <Button variant="text" onClick={updatePassword}>
                Change Password
            </Button>
        </div>
    );
}
