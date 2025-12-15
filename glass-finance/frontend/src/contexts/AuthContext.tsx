import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface User {
    id: string;
    email: string;
    username: string;
    avatar?: string;
    currency: string;
    language: string;
}

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, username: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: Partial<User>) => Promise<void>;
    refreshToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Get tokens from localStorage
    const getAccessToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken');
        }
        return null;
    };

    const getRefreshToken = () => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('refreshToken');
        }
        return null;
    };

    // Set tokens in localStorage
    const setTokens = (accessToken: string, refreshToken: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
        }
    };

    // Clear tokens from localStorage
    const clearTokens = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    };

    // Fetch current user
    const fetchUser = useCallback(async () => {
        const token = getAccessToken();
        if (!token) {
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/users/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUser(data.data);
            } else {
                // Token might be expired, try to refresh
                await refreshToken();
            }
        } catch (error) {
            console.error('Failed to fetch user:', error);
            clearTokens();
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Login
    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Login failed');
            }

            const data = await response.json();
            setTokens(data.data.accessToken, data.data.refreshToken);
            setUser(data.data.user);
            navigate('/dashboard');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Register
    const register = async (email: string, username: string, password: string) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, username, password }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Registration failed');
            }

            const data = await response.json();
            setTokens(data.data.accessToken, data.data.refreshToken);
            setUser(data.data.user);
            navigate('/dashboard');
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        setIsLoading(true);
        try {
            const token = getAccessToken();
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            clearTokens();
            setUser(null);
            setIsLoading(false);
            navigate('/login');
        }
    };

    // Update user
    const updateUser = async (data: Partial<User>) => {
        const token = getAccessToken();
        if (!token) throw new Error('Not authenticated');

        try {
            const response = await fetch(`${API_URL}/users/profile`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Update failed');
            }

            const result = await response.json();
            setUser(result.data);
        } catch (error) {
            console.error('Update user error:', error);
            throw error;
        }
    };

    // Refresh token
    const refreshToken = async () => {
        const refresh = getRefreshToken();
        if (!refresh) {
            clearTokens();
            setUser(null);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/auth/refresh`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ refreshToken: refresh }),
            });

            if (!response.ok) {
                throw new Error('Token refresh failed');
            }

            const data = await response.json();
            setTokens(data.data.accessToken, data.data.refreshToken);
            await fetchUser();
        } catch (error) {
            console.error('Token refresh error:', error);
            clearTokens();
            setUser(null);
            navigate('/login');
        }
    };

    // Initialize auth state
    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    // Auto refresh token before expiry
    useEffect(() => {
        const token = getAccessToken();
        if (!token) return;

        // Refresh token every 14 minutes (tokens expire in 15 minutes)
        const interval = setInterval(() => {
            refreshToken();
        }, 14 * 60 * 1000);

        return () => clearInterval(interval);
    }, [user]);

    const value: AuthContextType = {
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
        refreshToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

export default AuthContext;
