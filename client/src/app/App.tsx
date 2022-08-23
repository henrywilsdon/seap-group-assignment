import React, { ChangeEvent, useState } from 'react';
import logo from '../logo.svg';
import { Button, TextField, Typography } from '@mui/material';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePass = (event: any) => {
        setPassword(event.target.value);
    };

    const displayInfo = (event: any) => {};

    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <Typography variant="h1">
                    {username}
                    {password}
                </Typography>

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
            </header>
        </div>
    );
}

export default App;
