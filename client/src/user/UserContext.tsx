import React, { createContext, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    login: (username: string, password: string) => Promise<any>;
    register: (username: string, email: string, password: string) => void;
    logout: () => void;
    changeName: (username: string) => void;
}

interface User {
    username: string;
}

const UserContext = createContext<UserContextState>({
    user: null,
    login: () => Promise.resolve(),
    register: () => null,
    logout: () => null,
    changeName: (username: string) => null,
});

export const UserConsumer = UserContext.Consumer;
export const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useState<User | null>(null);
    const loginPending = useRef(false);

    useEffect(() => {
        if (!user && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [location, user, navigate]);

    const login = (username: string, password: string): Promise<any> => {
        // Prevent a new request being created if one is already pending
        if (loginPending.current) {
            return Promise.resolve();
        }
        loginPending.current = true;

        // Create new request
        const promise = fetch('http://localhost:8000/server_functions/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                username,
                password,
            }),
        });

        promise.finally(() => (loginPending.current = false));

        // Do stuff if the request returned a response
        // Return the promise so that if an error occured creating the response
        //  or if the server reponse is an error/failure it can be caught by the
        //  callee of this function(maybe to provide an error message for the user)
        return promise.then(async (response) => {
            if (response.ok) {
                // Get json reponse body
                // const user = await response.json();
                // setUser(user);
                setUser({ username });
                navigate('athletes');
            } else {
                throw new Error(await response.text());
            }
        });
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

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                changeName,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
