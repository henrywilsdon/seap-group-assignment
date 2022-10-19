import React, {
    createContext,
    useCallback,
    useEffect,
    useRef,
    useState,
} from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import useOnLoad from '../common/useOnLoad';
import {
    changeUserPassword,
    getMyself,
    loginUser,
    logoutUser,
    registerUser,
    updateUser,
} from './userAPI';

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
    const [user, setUser] = useState<User | null>(null);
    const registerPending = useRef(false);
    const loginPending = useRef(false);
    const updatePending = useRef(false);
    const prevUser = useRef<User | null>(null);

    const checkUserLoggedIn = useCallback(() => {
        getMyself()
            .then(async (_user) => {
                setUser({ username: _user.username, email: _user.email });
                if (
                    location.pathname.startsWith('/login') ||
                    location.pathname.startsWith('/register')
                ) {
                    navigate('/predictions');
                }
            })
            .catch((error) => {
                console.error(error);
                navigate('/login');
            });
    }, [navigate, location]);

    // Check if user already logged in
    useOnLoad(() => {
        checkUserLoggedIn();
    });

    // If user is set to null, check they are logged out
    useEffect(() => {
        if (!!prevUser.current && !user) {
            checkUserLoggedIn();
        }
        prevUser.current = user;
    }, [user, checkUserLoggedIn]);

    const logout = useCallback(() => {
        return logoutUser().finally(() => {
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
        const promise = loginUser(username, password);

        promise.finally(() => (loginPending.current = false));
        return promise.then(async (sessionId) => {
            setUser({ username });
            navigate('athletes');
            const sessionExpire = new Date();
            sessionExpire.setDate(sessionExpire.getDate() + 14);
            document.cookie = `sessionid=${sessionId}; expires=${sessionExpire.toTimeString()}; Path=/; SameSite=Lax`;
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
        return registerUser(username, email, password).finally(
            () => (registerPending.current = false),
        );
    };

    const changeUserInfo = (username: string, email: string): Promise<any> => {
        if (updatePending.current) {
            return Promise.resolve();
        }
        updatePending.current = true;

        const promise = updateUser(username, email);

        promise.finally(() => (updatePending.current = false));

        return promise.then(async () => {
            setUser({ username, email });
            alert('Profile successfully updated.');
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

        const promise = changeUserPassword(newPassword, currentPassword);

        promise.finally(() => (updatePending.current = false));

        return promise.then(async () => {
            setUser(null);
            alert('Password successfully updated.');
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
