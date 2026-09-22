import React from 'react';
import { ThemeProvider } from './ThemeContext';
import { AuthProvider } from './AuthContext';
import { PostProvider } from './PostContext';

import { UIProvider } from './UIContext';

export const AppContextProvider = ({ children }) => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <PostProvider>
          <UIProvider>
            {children}
          </UIProvider>
        </PostProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};
