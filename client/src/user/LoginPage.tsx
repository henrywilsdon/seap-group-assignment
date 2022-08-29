import { Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import './LoginPage.css';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleName = (event: any) => {
        setUsername(event.target.value);
        setErrorMessage('');
    };

    const handlePass = (event: any) => {
        setPassword(event.target.value);
        setErrorMessage('');
    };

    const handleClick = () => {
        login(username, password).catch((error) => {
            setErrorMessage(error.message);
        });
    };

    const handleReg = () => {
        navigate('/register');
    };

    return (
        <div className="LoginPage">
            <Typography variant="h4">
                Welcome! Please enter your username and password to login.
            </Typography>

            <TextField
                color="primary"
                variant="standard"
                label="Username"
                value={username}
                onChange={handleName}
                error={!!errorMessage}
            />

            <TextField
                color="primary"
                variant="standard"
                label="Password"
                value={password}
                onChange={handlePass}
                error={!!errorMessage}
                helperText={errorMessage}
                type="password"
                sx={{
                    marginBottom: 2,
                }}
            />

            <Button
                variant="contained"
                onClick={handleClick}
                sx={{ marginBottom: 2 }}
            >
                Submit
            </Button>

            <Button variant="contained" onClick={handleReg}>
                Register Account
            </Button>
        </div>
    );
}

export default LoginPage;
