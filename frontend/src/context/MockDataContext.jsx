import React, { createContext, useContext, useState, useCallback } from 'react';
import { users as mockUsers, messages } from '../data/mockData';

const MockDataContext = createContext(null);

export const MockDataProvider = ({ children }) => {
  const [users, setUsers] = useState(mockUsers);
  
  // Calculate unreadMessages exactly as in the original appStore
  const unreadMessages = messages.reduce((sum, message) => sum + message.unread, 0);

  const followUser = useCallback((userId) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, isFollowing: !user.isFollowing } : user
      )
    );
  }, []);

  const value = {
    users,
    followUser,
    unreadMessages,
  };

  return <MockDataContext.Provider value={value}>{children}</MockDataContext.Provider>;
};

export const useMockData = () => {
  const context = useContext(MockDataContext);
  if (!context) {
    throw new Error('useMockData must be used within a MockDataProvider');
  }
  return context;
};
