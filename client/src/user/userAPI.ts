interface User {
    username?: string;
    email?: string;
}

export function getMyself(): Promise<User> {
    return fetch('http://localhost:8000/api/user/me/', {
        method: 'GET',
        credentials: 'include',
    }).then(async (response) => {
        if (response.ok) {
            return await response.json();
        } else {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

export function logoutUser(): Promise<any> {
    return fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        credentials: 'include',
    }).then(async (response) => {
        if (!response.ok) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

export function loginUser(username: string, password: string): Promise<string> {
    return fetch('http://localhost:8000/api/login/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
        }),
        credentials: 'include',
    }).then(async (response) => {
        if (response.ok) {
            const { sessionId } = await response.json();
            return sessionId;
        } else {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

export function registerUser(
    username: string,
    email: string,
    password: string,
): Promise<any> {
    return fetch('http://localhost:8000/api/register/', {
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
    }).then(async (response) => {
        if (!response.ok) {
            if (response.status === 400) {
                throw new Error('Username or email already in use');
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
}

export function updateUser(username: string, email: string): Promise<any> {
    return fetch('http://localhost:8000/api/user/me/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            email,
        }),
    }).then(async (response) => {
        if (!response.ok) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}

export function changeUserPassword(
    newPassword: string,
    currentPassword: string,
): Promise<any> {
    return fetch('http://localhost:8000/api/user/me/password/', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            newPassword,
            currentPassword,
        }),
    }).then(async (response) => {
        if (!response.ok) {
            if (response.headers.get('Content-Type') === 'application/json') {
                const data = await response.json();
                throw new Error(data?.detail);
            } else {
                throw new Error(response.statusText + response.status);
            }
        }
    });
}
