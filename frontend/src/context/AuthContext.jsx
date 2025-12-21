import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for stored user
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        // Enforce valid roles: 'customer' | 'agent' | 'admin'
        // Default mock user if just "clicking login"
        const defaultUser = {
            id: '1',
            name: 'Demo User',
            email: 'demo@example.com',
            role: 'admin', // Default role
            avatar: null
        };

        const userToSet = { ...defaultUser, ...userData };
        console.log("Logging in as:", userToSet.role);

        setUser(userToSet);
        localStorage.setItem('user', JSON.stringify(userToSet));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
