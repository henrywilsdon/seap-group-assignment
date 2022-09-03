import { resolve } from 'path';
import React, { createContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    login: (username: string, password: string) => void;
    register: (
        username: string,
        email: string,
        password: string,
    ) => Promise<any>;
    logout: () => void;
    changeName: (username: string) => void;
    changePassword: (password: string) => void;
    changeEmail: (email: string) => void;
}

interface User {
    email?: string;
    username?: string;
}

const UserContext = createContext<UserContextState>({
    user: null,
    login: () => null,
    register: () => Promise.resolve(),
    logout: () => null,
    changeName: (username: string) => null,
    changePassword: (password: string) => null,
    changeEmail: (email: string) => null,
});

export const UserConsumer = UserContext.Consumer;
export const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPass] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const registerPending = useRef(false);

    useEffect(() => {
        if (!user && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [location, user, navigate]);

    const login = (username: string, password: string) => {
        setUser({ ...user, username });
        navigate('/athletes');
    };

    const register = (
        username: string,
        email: string,
        password: string,
    ): Promise<any> => {
        //prevent duplicate register request with pending request
        if (registerPending.current) {
            return Promise.resolve();
        }
        registerPending.current = true;

        //new Request to register account
        const promise = fetch(
            'http://localhost:8000/server_functions/register',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                    password,
                }),
            },
        );

        promise.finally(() => (registerPending.current = false));

        return promise
            .then(async (response) => {
                if (response.ok) {
                    setUser({ username, email });
                    setPass(password);
                    navigate('/athletes');
                } else {
                    if (
                        response.headers.get('Content-Type') ===
                        'application/json'
                    ) {
                        const data = await response.json();
                        throw new Error(data?.detail);
                    } else {
                        throw new Error(response.statusText + response.status);
                    }
                }
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const logout = () => {
        setUser(null);
    };

    const changeName = (username: string) => {
        setUser({ ...user, username });
    };

    const changePassword = (password: string) => {
        //setPass({ password });
    };

    const changeEmail = (email: string) => {
        setUser({ ...user, email });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                changeName,
                changePassword,
                changeEmail,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
