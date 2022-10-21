import { Button, TextField, Tooltip, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import './ManageProfilePage.css';
import useOnLoad from '../common/useOnLoad';
import UserContext from '../user/UserContext';

type Props = {};

export default function ManageProfilePage({}: Props) {
    const { changeUserInfo } = useContext(UserContext);
    const { changePassword } = useContext(UserContext);
    const { user } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newPassword2, setNewPassword2] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [email, setEmail] = useState('');
    const [userErrorMessage, setUserErrorMessage] = useState('');
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    //NAME
    const handleName = (event: any) => {
        setUsername(event.target.value);
        setUserErrorMessage('');
    };

    const updateInfo = () => {
        changeUserInfo(username, email).catch((error) => {
            setUserErrorMessage(error.message);
        });
    };

    //EMAIL
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
        setUserErrorMessage('');
    };

    //PASSWORD
    const handleNewPassword = (event: any) => {
        setNewPassword(event.target.value);
        setPasswordErrorMessage('');
    };

    const handleNewPassword2 = (event: any) => {
        setNewPassword2(event.target.value);
        setPasswordErrorMessage('');
    };

    const handleCurrentPassword = (event: any) => {
        setCurrentPassword(event.target.value);
        setPasswordErrorMessage('');
    };

    const updatePassword = () => {
        if (
            newPassword === newPassword2 &&
            newPassword != null &&
            newPassword != ''
        ) {
            changePassword(newPassword, currentPassword).catch((error) => {
                setPasswordErrorMessage(error.message);
            });
        } else if (newPassword != newPassword2) {
            alert('Passwords do not match.');
        } else {
            alert('Enter a valid password.');
        }
    };

    useOnLoad(() => {
        setUsername(user?.username || '');
        setEmail(user?.email || '');
    });

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
                    error={!!userErrorMessage}
                />
            </Tooltip>

            <Tooltip title="Enter your new email" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Email"
                    value={email}
                    onChange={handleEmail}
                    error={!!userErrorMessage}
                    helperText={userErrorMessage}
                    sx={{
                        marginBottom: 2,
                    }}
                />
            </Tooltip>

            <Button variant="contained" onClick={updateInfo}>
                Update User Info
            </Button>

            <Tooltip title="Enter your current password" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="Current Password"
                    type="password"
                    value={currentPassword}
                    onChange={handleCurrentPassword}
                    error={!!passwordErrorMessage}
                />
            </Tooltip>

            <Tooltip title="Enter your new password" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Password"
                    type="password"
                    value={newPassword}
                    onChange={handleNewPassword}
                    error={!!passwordErrorMessage}
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
                    type="password"
                    value={newPassword2}
                    onChange={handleNewPassword2}
                    error={!!passwordErrorMessage}
                    helperText={passwordErrorMessage}
                    sx={{
                        marginBottom: 2,
                    }}
                />
            </Tooltip>

            <Button variant="contained" onClick={updatePassword}>
                Change Password
            </Button>
        </div>
    );
}
