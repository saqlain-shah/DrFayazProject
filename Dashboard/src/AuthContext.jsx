import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve user data from local storage if available
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    // Save user data to local storage whenever it changes
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

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
    localStorage.removeItem('user');

    // Clear user data from state
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
