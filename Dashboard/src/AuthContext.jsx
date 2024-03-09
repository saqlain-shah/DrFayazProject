import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, the user is not logged in

  const login = (userData) => {
    // Set user data in state when the user logs in
    setUser(userData);
  };

  const logout = () => {
    // Perform your logout logic here, such as clearing user data from state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

