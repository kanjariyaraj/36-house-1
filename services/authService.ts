import { User, UserRole } from '../types';

const TOKEN_KEY = 'event_platform_token';

// --- API Client Functions ---

const handleResponse = async (response: Response) => {
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    return data;
};

export const signup = (email: string, password: string, role: UserRole): Promise<{ token: string; user: User }> => {
    return fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
    }).then(handleResponse);
};

export const login = (email: string, password: string): Promise<{ token: string; user: User }> => {
    return fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
    }).then(handleResponse);
};

export const loginWithGoogle = (): Promise<{ token: string; user: User }> => {
    // This remains a simulation as it requires complex OAuth setup.
    // In a real app, this would redirect to Google and handle a callback.
    console.warn("Google Login is simulated and uses a mock user.");
    return Promise.resolve({
      token: `jwt_token_google_${Date.now()}`,
      user: { id: 'user_google_1', email: 'attendee.google@example.com', role: UserRole.Attendee }
    });
};

export const requestPasswordReset = (email: string): Promise<void> => {
    return fetch('/api/auth/request-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    }).then(handleResponse);
};

export const resetPassword = (token: string, newPassword: string): Promise<void> => {
    return fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
    }).then(handleResponse);
};

export const getUserFromToken = (token: string): Promise<User> => {
    return fetch('/api/auth/me', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).then(handleResponse);
};


// --- Token Management ---

export const setToken = (token: string, remember: boolean) => {
    removeToken(); // Clear any existing tokens first
    if (remember) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        sessionStorage.setItem(TOKEN_KEY, token);
    }
};

export const getToken = (): string | null => {
    return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
};

export const removeToken = () => {
    localStorage.removeItem(TOKEN_KEY);
    sessionStorage.removeItem(TOKEN_KEY);
};