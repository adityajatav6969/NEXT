import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { io } from 'socket.io-client';
import api from '../utils/api';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || `http://${window.location.hostname}:5000`;

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  
  const socketRef = useRef(null);

  const connectSocket = useCallback((currentUser) => {
    if (!currentUser) return null;

    if (socketRef.current) {
      if (!socketRef.current.connected) {
        socketRef.current.connect();
      }
      return socketRef.current;
    }

    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    newSocket.on('connect_error', (error) => {
      console.warn('Socket connection error:', error.message);
    });

    socketRef.current = newSocket;
    setSocket(newSocket);
    return newSocket;
  }, []);

  const disconnectSocket = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
      socketRef.current = null;
    }
    setSocket(null);
  }, []);

  const applyAuthenticatedUser = useCallback((userData) => {
    setIsAuthReady(true);
    setIsAuthenticated(true);
    setUser(userData);
    connectSocket(userData);
    return userData;
  }, [connectSocket]);

  const resetAuthState = useCallback(() => {
    disconnectSocket();
    setIsAuthReady(true);
    setIsAuthenticated(false);
    setUser(null);
  }, [disconnectSocket]);

  const hydrateAuth = useCallback(async () => {
    try {
      const { data } = await api.get('/auth/me');
      return applyAuthenticatedUser(data);
    } catch (error) {
      resetAuthState();
      throw error;
    }
  }, [applyAuthenticatedUser, resetAuthState]);

  const completeAuth = useCallback(async (fallbackUser = null) => {
    const delays = [0, 100, 250];

    for (const delay of delays) {
      if (delay > 0) {
        await new Promise((resolve) => {
          window.setTimeout(resolve, delay);
        });
      }

      try {
        const { data } = await api.get('/auth/me');
        return applyAuthenticatedUser(data);
      } catch {
        // Retry a couple times to let the session cookie settle in the browser.
      }
    }

    if (fallbackUser) {
      return applyAuthenticatedUser(fallbackUser);
    }

    resetAuthState();
    throw new Error('Unable to establish session');
  }, [applyAuthenticatedUser, resetAuthState]);

  const login = useCallback((userData) => {
    disconnectSocket();
    return applyAuthenticatedUser(userData);
  }, [disconnectSocket, applyAuthenticatedUser]);

  const logout = useCallback(async ({ skipServer = false } = {}) => {
    if (!skipServer) {
      try {
        await api.post('/auth/logout');
      } catch {
        // Best-effort logout.
      }
    }
    resetAuthState();
  }, [resetAuthState]);

  const value = {
    isAuthReady,
    isAuthenticated,
    user,
    socket,
    connectSocket: () => connectSocket(user),
    disconnectSocket,
    hydrateAuth,
    completeAuth,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
