import { useContext, useState } from 'react';
import { Button, TextField, Typography } from '@mui/material';
import './RegisterPage.css';
import UserContext from '../user/UserContext';

type Props = {};

export default function RegisterPage({}: Props) {
    const { register } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //username
    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    //email
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
    };

    //password

    const handlePassword = (event: any) => {
        setPassword(event.target.value);
    };
    //button click
    const handleClick = (event: any) => {
        register(username, email, password);
    };

    return (
        <div className="RegisterPage">
            <Typography variant="h4">Register Account</Typography>
            <TextField
                color="primary"
                variant="standard"
                label="Email Address"
                value={email}
                onChange={handleEmail}
            />

            <TextField
                color="primary"
                variant="standard"
                label="Username"
                value={username}
                onChange={handleName}
            />

            <TextField
                color="primary"
                variant="standard"
                label="Password"
                type="password"
                value={password}
                onChange={handlePassword}
                sx={{ marginBottom: 2 }}
            />

            <Button variant="contained" onClick={handleClick}>
                Create Account
            </Button>
        </div>
    );
}
