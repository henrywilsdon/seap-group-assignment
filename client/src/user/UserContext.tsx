import React, {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import useOnLoad from '../common/useOnLoad';

interface ProviderProps {
    children: React.ReactNode;
}

interface UserContextState {
    user: User | null;
    login: (username: string, password: string) => Promise<any>;
    register: (
        username: string,
        email: string,
        password: string,
    ) => Promise<any>;
    logout: () => void;
    changeUserInfo: (username: string, email: string) => Promise<any>;
    changePassword: (
        newPassword: string,
        currentPassword: string,
    ) => Promise<any>;
}

interface User {
    username?: string;
    email?: string;
}

const UserContext = createContext<UserContextState>({
    user: null,

    login: () => Promise.resolve(),
    register: () => Promise.resolve(),

    logout: () => null,
    changeUserInfo: (username: string, email: string) => Promise.resolve(),
    changePassword: (newPassword: string, currentPassword: string) =>
        Promise.resolve(),
});

export const UserConsumer = UserContext.Consumer;
export const UserProvider = ({ children }: ProviderProps): JSX.Element => {
    const location = useLocation();
    const navigate = useNavigate();
    const [password, setPass] = useState('');
    const [user, setUser] = useState<User | null>(null);
    const registerPending = useRef(false);
    const loginPending = useRef(false);
    const updatePending = useRef(false);

    useEffect(() => {
        if (!user && !['/login', '/register'].includes(location.pathname)) {
            navigate('/login');
        }
    }, [location, user, navigate]);

    const getUser = useCallback(() => {
        return fetch('http://localhost:8000/server_functions/user/me/', {
            method: 'GET',
            credentials: 'include',
        })
            .then(async (response) => {
                if (response.ok) {
                    const _user = await response.json();
                    setUser({ username: _user.username });
                    navigate('athletes');
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
    }, [navigate]);

    useOnLoad(() => {
        getUser();
    });

    const logout = useCallback(() => {
        return fetch('http://localhost:8000/server_functions/logout/', {
            method: 'POST',
            credentials: 'include',
        })
            .then(async (response) => {
                if (response.ok) {
                    setUser(null);
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
            })
            .finally(() => {
                // Log user out from client regardless of if the request succeeded
                setUser(null);
                document.cookie = 'sessionid=; Max-Age=-99999999;';
            });
    }, []);

    const login = (username: string, password: string): Promise<any> => {
        // Prevent a new request being created if one is already pending
        if (loginPending.current) {
            return Promise.resolve();
        }
        loginPending.current = true;

        // Create new request
        const promise = fetch('http://localhost:8000/server_functions/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: username,
                password,
            }),
            credentials: 'include',
        });

        promise.finally(() => (loginPending.current = false));

        // Do stuff if the request returned a response
        // Return the promise so that if an error occured creating the response
        //  or if the server reponse is an error/failure it can be caught by the
        //  callee of this function(maybe to provide an error message for the user)
        return promise.then(async (response) => {
            if (response.ok) {
                const { sessionId } = await response.json();
                setUser({ username });
                navigate('athletes');
                const sessionExpire = new Date();
                sessionExpire.setDate(sessionExpire.getDate() + 14);
                document.cookie = `sessionid=${sessionId}; expires=${sessionExpire.toTimeString()}; Path=/; SameSite=Lax`;
            } else {
                if (
                    response.headers.get('Content-Type') === 'application/json'
                ) {
                    const data = await response.json();
                    throw new Error(data?.detail);
                } else {
                    throw new Error(response.statusText + response.status);
                }
            }
        });
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
            'http://localhost:8000/server_functions/register/',
            {
                credentials: 'include',
                method: 'POST',
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

        return promise.then(async (response) => {
            console.log(response);

            if (response.ok) {
                console.log('Here');
                setUser({ username, email });
                setPass(password);
                navigate('/login');
            } else {
                if (response.status === 400) {
                    throw new Error('Email already in use');
                } else if (
                    response.headers.get('Content-Type') === 'application/json'
                ) {
                    const data = await response.json();
                    throw new Error(data?.detail);
                } else {
                    throw new Error(response.statusText + response.status);
                }
            }
        });
    };

    const changeUserInfo = (username: string, email: string): Promise<any> => {
        if (updatePending.current) {
            return Promise.resolve();
        }
        updatePending.current = true;

        const promise = fetch(
            'http://localhost:8000/server_functions/user/me/',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username,
                    email,
                }),
            },
        );

        promise.finally(() => (updatePending.current = false));

        return promise.then(async (response) => {
            if (response.ok) {
                setUser({ username, email });
                alert('Profile successfully updated.');
            } else {
                if (
                    response.headers.get('Content-Type') === 'application/json'
                ) {
                    const data = await response.json();
                    throw new Error(data?.detail);
                } else {
                    throw new Error(response.statusText + response.status);
                }
            }
        });
    };

    const changePassword = (
        newPassword: string,
        currentPassword: string,
    ): Promise<any> => {
        if (updatePending.current) {
            return Promise.resolve();
        }
        updatePending.current = true;

        const promise = fetch(
            'http://localhost:8000/server_functions/user/me/password/',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    newPassword,
                    currentPassword,
                }),
            },
        );

        promise.finally(() => (updatePending.current = false));

        return promise.then(async (response) => {
            if (response.ok) {
                setPass(newPassword);
                alert('Password successfully updated.');
            } else {
                if (
                    response.headers.get('Content-Type') === 'application/json'
                ) {
                    const data = await response.json();
                    throw new Error(data?.detail);
                } else {
                    throw new Error(response.statusText + response.status);
                }
            }
        });
    };

    return (
        <UserContext.Provider
            value={{
                user,
                login,
                register,
                logout,
                changeUserInfo,
                changePassword,
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
