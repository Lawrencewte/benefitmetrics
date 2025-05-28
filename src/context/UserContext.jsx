import React, { createContext, useContext, useState } from 'react';

// Create the initial context
const UserContext = createContext(null);

// Create a provider component
export const UserProvider = ({ children }) => {
  const [userData, setUserData] = useState({
    name: 'Taylor',
    points: 250,
    notifications: 3,
    showNotificationAlert: true,
  });

  // Function to update user points
  const updatePoints = (newPoints) => {
    setUserData(prev => ({
      ...prev,
      points: newPoints
    }));
  };

  // Function to update notifications
  const updateNotifications = (count) => {
    setUserData(prev => ({
      ...prev,
      notifications: count
    }));
  };

  // Function to clear notification alert
  const clearNotificationAlert = () => {
    setUserData(prev => ({
      ...prev,
      showNotificationAlert: false
    }));
  };

  // Function to update user name
  const updateUserName = (name) => {
    setUserData(prev => ({
      ...prev,
      name
    }));
  };

  return (
    <UserContext.Provider value={{
      userData,
      updatePoints,
      updateNotifications,
      clearNotificationAlert,
      updateUserName
    }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a custom hook to use the context
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export default UserContext;