import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { fetchCurrentUser } from '../api/api';

const AuthContext = createContext(null);

const getPersistedUser = (userData) => {
    if (!userData) return null;

    const {
        _id,
        username,
        role,
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        profilePhoto,
    } = userData;

    return {
        _id,
        username,
        role,
        firstName,
        lastName,
        email,
        phone,
        city,
        country,
        profilePhoto,
    };
};

const persistUserToStorage = (userData) => {
    const persistedUser = getPersistedUser(userData);

    try {
        if (persistedUser) {
            localStorage.setItem('user', JSON.stringify(persistedUser));
        } else {
            localStorage.removeItem('user');
        }
    } catch (error) {
        if (error?.name === 'QuotaExceededError') {
            localStorage.removeItem('user');
            return;
        }

        throw error;
    }
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isInitialized, setIsInitialized] = useState(false);

    const clearAuthState = useCallback(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    }, []);

    // Initialize auth on app load
    useEffect(() => {
        const initializeAuth = async () => {
            try {
                const savedToken = localStorage.getItem('token');
                const savedUser = localStorage.getItem('user');

                if (savedToken) {
                    setToken(savedToken);
                    
                    // Try to restore user from localStorage first
                    if (savedUser) {
                        try {
                            const userData = JSON.parse(savedUser);
                            setUser(userData);
                        } catch {
                            console.error('Failed to parse saved user data');
                            localStorage.removeItem('user');
                        }
                    }
                    
                    // Verify token is still valid by fetching current user
                    try {
                        const userData = await fetchCurrentUser();
                        setUser(userData);
                        persistUserToStorage(userData);
                    } catch (err) {
                        const status = err?.response?.status;
                        if (status === 401 || status === 403) {
                            clearAuthState();
                        } else {
                            console.error('Failed to verify token:', err);
                        }
                        // Keep existing user data if network error
                    }
                }
            } finally {
                setLoading(false);
                setIsInitialized(true);
            }
        };

        initializeAuth();
    }, [clearAuthState]);

    // Sync token changes to localStorage
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
        }
    }, [token]);

    // Sync user changes to localStorage
    useEffect(() => {
        persistUserToStorage(user);
    }, [user]);

    const login = useCallback((userData, userToken) => {
        setUser(userData);
        setToken(userToken);
    }, []);

    const logout = useCallback(() => {
        clearAuthState();
    }, [clearAuthState]);

    const updateUser = useCallback((updates) => {
        setUser(prev => ({ ...prev, ...updates }));
    }, []);

    const value = {
        user,
        token,
        loading,
        isInitialized,
        login,
        logout,
        updateUser,
        isAuthenticated: !!user && !!token
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
