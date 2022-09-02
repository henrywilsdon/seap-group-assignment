import { Button, TextField, Tooltip, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import UserContext from '../user/UserContext';
import './ManageProfilePage.css';

type Props = {};

export default function ManageProfilePage({}: Props) {
    const { changeUserInfo } = useContext(UserContext);
    const { changePassword } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
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
    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    };

    const handlePassword2 = (event: any) => {
        setPassword2(event.target.value);
    };

    const updatePassword = () => {
        if (password === password2 && password != null && password != '') {
            changePassword(password);
        } else if (password != password2) {
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

            <Tooltip title="Enter your new password" placement="right-end">
                <TextField
                    color="primary"
                    variant="standard"
                    label="New Password"
                    value={password}
                    onChange={handlePassword}
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
                    value={password2}
                    onChange={handlePassword2}
                />
            </Tooltip>

            <Button variant="text" onClick={updatePassword}>
                Change Password
            </Button>
        </div>
    );
}
