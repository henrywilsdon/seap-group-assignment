import { Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';
import UserContext from './UserContext';

function LoginPage() {
    const { login } = useContext(UserContext);
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleName = (event: any) => {
        setUsername(event.target.value);
    };

    const handlePass = (event: any) => {
        setPassword(event.target.value);
    };

    const handleClick = () => {
        login(username, password);
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
            />

            <TextField
                color="primary"
                type="password"
                variant="standard"
                label="Password"
                value={password}
                onChange={handlePass}
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
