import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authenticated, setAuthenticated] = useState(localStorage.getItem('token') !== null);

    const login = (token) => {
        localStorage.setItem('token', token);
        setAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        setAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ authenticated, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
