// NotificationContext.js
import React, { createContext, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const clearNotifications = () => {
    setNotifications([]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, clearNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
