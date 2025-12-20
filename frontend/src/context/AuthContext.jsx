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
        // userData should include role: 'customer' | 'agent' | 'admin'
        // Default mock behavior if not provided
        const userToSet = userData || {
            id: '1',
            name: 'John Doe',
            email: 'john@example.com',
            role: 'customer',
            avatar: null
        };

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
