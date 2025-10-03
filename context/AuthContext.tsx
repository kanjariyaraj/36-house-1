import React, { FC, ReactNode, createContext, useState, useCallback, useEffect, useContext } from 'react';
import { User, UserRole } from '../types';
import * as authService from '../services/authService';

interface AuthContextType {
    user: User | null;
    token: string | null;
    isLoading: boolean;
    login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
    signup: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
    loginWithGoogle: () => Promise<void>;
    revalidateUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const revalidateUser = useCallback(async () => {
        const storedToken = authService.getToken();
        if (storedToken) {
            try {
                const userData = await authService.getUserFromToken(storedToken);
                setUser(userData);
                setToken(storedToken);
            } catch (error) {
                console.error("Session invalid. Logging out.", error);
                logout();
            }
        }
        setIsLoading(false);
    }, []);


    useEffect(() => {
        revalidateUser();
    }, [revalidateUser]);

    const login = async (email: string, password: string, rememberMe: boolean) => {
        const { token, user } = await authService.login(email, password);
        authService.setToken(token, rememberMe);
        setToken(token);
        setUser(user);
    };

    const signup = async (email: string, password: string, role: UserRole) => {
        const { token, user } = await authService.signup(email, password, role);
        authService.setToken(token, true); // Always remember on signup
        setToken(token);
        setUser(user);
    };

    const loginWithGoogle = async () => {
        const { token, user } = await authService.loginWithGoogle();
        authService.setToken(token, true); // Always remember on social login
        setToken(token);
        setUser(user);
    };

    const logout = () => {
        authService.removeToken();
        setUser(null);
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isLoading, login, signup, logout, loginWithGoogle, revalidateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};