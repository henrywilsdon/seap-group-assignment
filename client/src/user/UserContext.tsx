import React, { createContext, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    login: (username: string, password: string) => void;
    logout: () => void;
    changeName: (username: string) => void;
}

interface User {
    username: string;
}

const UserContext = createContext<UserContextState>({
    user: null,
    login: () => null,
    logout: () => null,
    changeName: (username: string) => null,
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
        setUser({ username });
        navigate('/athletes');
    };

    const logout = () => {
        setUser(null);
    };

    const changeName = (username: string) => {
        setUser({ username });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                logout,
                changeName,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
