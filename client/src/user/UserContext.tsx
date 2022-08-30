import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    pass: Pass | null;
    mail: Email | null;
    login: (username: string, password: string) => void;
    register: (username: string, email: string, password: string) => void;
    logout: () => void;
    changeName: (username: string) => void;
    changePassword: (password: string) => void;
    changeEmail: (email: string) => void;
}

interface User {
    username: string;
}

interface Pass {
    password: string;
}

interface Email {
    email: string;
}

const UserContext = createContext<UserContextState>({
    user: null,
    pass: null,
    mail: null,
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
    const [pass, setPass] = useState<Pass | null>(null);
    const [mail, setEmail] = useState<Email | null>(null);
    const [openConfirmUpdate, setOpenConfirmUpdate] = useState(false);

    useEffect(() => {
        if (!user && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [location, user, navigate]);

    const login = (username: string, password: string) => {
        setUser({ username });
        navigate('/athletes');
    };

    const register = (username: string, email: string, password: string) => {
        setUser({ username });
        navigate('/athletes');
    };

    const logout = () => {
        setUser(null);
    };

    const changeName = (username: string) => {
        setUser({ username });
    };

    const changePassword = (password: string) => {
        setPass({ password });
    };

    const changeEmail = (email: string) => {
        setEmail({ email });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                pass,
                mail,
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
