import { useContext, useState } from 'react';
import { Button, TextField, Typography, Alert } from '@mui/material';
import './RegisterPage.css';
import UserContext from '../user/UserContext';

type Props = {};

export default function RegisterPage({}: Props) {
    const { register } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    //username
    const handleName = (event: any) => {
        setUsername(event.target.value);
        setErrorMessage('');
    };

    //email
    const handleEmail = (event: any) => {
        setEmail(event.target.value);
        setErrorMessage('');
    };

    //password

    const handlePassword = (event: any) => {
        setPassword(event.target.value);
        setErrorMessage('');
    };
    //button click
    const handleClick = (event: any) => {
        register(username, email, password)
            .then(() => {
                //success message (alert/confirmation of success)
                var success = 'Account Created';
                alert(success);
            })
            .catch((error) => {
                //display error (user already exists)
                setErrorMessage(error.message);
            });
    };

    return (
        <div className="RegisterPage">
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Register Account
            </Typography>
            <TextField
                color="primary"
                variant="standard"
                label="Email Address"
                value={email}
                required
                onChange={handleEmail}
                error={!!errorMessage}
                helperText={errorMessage}
                sx={{ marginBottom: 2 }}
            />

            <TextField
                color="primary"
                variant="standard"
                label="Username"
                value={username}
                required
                onChange={handleName}
                sx={{ marginBottom: 2 }}
            />

            <TextField
                color="primary"
                variant="standard"
                label="Password"
                value={password}
                type="password"
                required
                onChange={handlePassword}
                sx={{ marginBottom: 4 }}
            />

            <Button variant="contained" onClick={handleClick}>
                Create Account
            </Button>
        </div>
    );
}
