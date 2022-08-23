import React, { ChangeEvent, useState } from 'react';
import { Alert, Button, TextField, Typography } from '@mui/material';
import './LoginPage.css';
import { userInfo } from 'os';

function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePass = (event: any) => {
        setPassword(event.target.value);
    };

    return (
        <div className="LoginPage">
            <Typography variant="h4">
                Welcome! Please enter your username and password to login.
            </Typography>

            <Typography variant="h5">{username}</Typography>

            <Typography variant="h5">{password}</Typography>

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
                value={password}
                onChange={handlePass}
                sx={{
                    marginBottom: 2,
                }}
            />

            <Button variant="contained">Submit</Button>
        </div>
    );
}

export default LoginPage;
