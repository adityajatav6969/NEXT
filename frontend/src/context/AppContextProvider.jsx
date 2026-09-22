import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { PostProvider } from './PostContext';
import { MockDataProvider } from './MockDataContext';
import { UIProvider } from './UIContext';

export const AppContextProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MockDataProvider>
          <PostProvider>
            <UIProvider>
              {children}
            </UIProvider>
          </PostProvider>
        </MockDataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
