import { Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import UserContext from '../user/UserContext';
import './ManageProfilePage.css';

type Props = {};

export default function ManageProfilePage({}: Props) {
    const { changeName } = useContext(UserContext);
    const { changeEmail } = useContext(UserContext);
    const { changePassword } = useContext(UserContext);

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    //NAME
    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    const updateName = () => {
        changeName(username);
    };

    //EMAIL
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    };

    const updateEmail = () => {
        changeEmail(email);
    };

    //PASSWORD
    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    };

    const updatePassword = () => {
        changePassword(password);
    };

    return (
        <div className="ManageProfilePage">
            <Typography variant="h4">User Profile</Typography>

            <TextField
                color="primary"
                variant="standard"
                label="Enter your new username"
                value={username}
                onChange={handleName}
            />

            <Button variant="text" onClick={updateName}>
                Update
            </Button>

            <TextField
                color="primary"
                variant="standard"
                label="Enter your new email"
                value={email}
                onChange={handleEmail}
            />

            <Button variant="text" onClick={updateEmail}>
                Update
            </Button>

            <TextField
                color="primary"
                variant="standard"
                label="Enter your new password"
                value={password}
                onChange={handlePassword}
            />

            <Button variant="text" onClick={updatePassword}>
                Update
            </Button>
        </div>
    );
}
