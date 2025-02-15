import { Button, TextField, Typography } from '@mui/material';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from '../user/UserContext';
import './RegisterPage.css';

export default function RegisterPage() {
    const { register } = useContext(UserContext);
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();

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
                const success = 'Account Created';
                alert(success);
            })
            .catch((error) => {
                //display error (user already exists)
                setErrorMessage(error.message);
            });
    };

    const handleLoginClick = () => {
        navigate('/login');
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
                type="password"
                value={password}
                required
                onChange={handlePassword}
                sx={{ marginBottom: 4 }}
            />

            <Button variant="contained" onClick={handleClick} sx={{ mb: 2 }}>
                Create Account
            </Button>
            <Button variant="contained" onClick={handleLoginClick}>
                Login
            </Button>
        </div>
    );
}
