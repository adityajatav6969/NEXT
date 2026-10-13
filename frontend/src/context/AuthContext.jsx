import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import api from '../utils/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);


  const applyAuthenticatedUser = useCallback((userData) => {
    setIsAuthReady(true);
    setIsAuthenticated(true);
    setUser(userData);
    return userData;
  }, []);

  const resetAuthState = useCallback(() => {
    setIsAuthReady(true);
    setIsAuthenticated(false);
    setUser(null);
  }, []);

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
    return applyAuthenticatedUser(userData);
  }, [applyAuthenticatedUser]);

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
