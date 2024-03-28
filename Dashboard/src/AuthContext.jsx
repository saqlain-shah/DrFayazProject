import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Initially, the user is not logged in

  const login = (userData) => {
    // Ensure that the userData object contains the id property
    if (!userData || !userData.id) {
      throw new Error('User data must include the id property');
    }

    // Set user data in state when the user logs in
    setUser(userData);
  };

  const logout = () => {
    // Clear any authentication tokens or states from local storage or cookies
    localStorage.removeItem('token');
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';

    // Clear user data from state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
