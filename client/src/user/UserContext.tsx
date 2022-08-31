import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    login: (username: string, password: string) => void;
    register: (username: string, email: string, password: string) => void;
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
    register: () => null,
    logout: () => null,
    changeName: (username: string) => null,
    changePassword: (password: string) => null,
    changeEmail: (email: string) => null,
});

export const UserConsumer = UserContext.Consumer;
export const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        if (!user && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [location, user, navigate]);

    const login = (username: string, password: string) => {
        setUser({ ...user, username });
        navigate('/athletes');
    };

    const register = (username: string, email: string, password: string) => {
        setUser({ username, email });
        navigate('/athletes');
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
