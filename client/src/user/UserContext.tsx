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
    login: () => Promise.resolve(),
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
    const loginPending = useRef(false);

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

    // useOnLoad(() => {
    //     getUser();
    // });

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

    const register = (username: string, email: string, password: string) => {
        setUser({ username, email });
        navigate('/athletes');
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
