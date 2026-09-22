import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { useAuth } from './context/AuthContext';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LandingPage from './pages/LandingPage';

// Lazy-loaded pages (code splitting)
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const FeedPage = lazy(() => import('./pages/FeedPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const JobsPage = lazy(() => import('./pages/JobsPage'));
const NetworkPage = lazy(() => import('./pages/NetworkPage'));
const MessagesPage = lazy(() => import('./pages/MessagesPage'));
const ExplorePage = lazy(() => import('./pages/ExplorePage'));
const CompaniesPage = lazy(() => import('./pages/CompaniesPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AudiencePage = lazy(() => import('./pages/AudiencePage'));

const LoadingSpinner = () => (
  <div className="h-screen w-full flex items-center justify-center bg-dark-50 dark:bg-dark-950">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-sm text-dark-400">Loading...</p>
    </div>
  </div>
);

const App = () => {
  const { isAuthenticated, isAuthReady, hydrateAuth, logout } = useAuth();

  useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  useEffect(() => {
    const handleAuthExpired = () => {
      logout({ skipServer: true });
    };

    window.addEventListener('auth:expired', handleAuthExpired);
    return () => window.removeEventListener('auth:expired', handleAuthExpired);
  }, [logout]);

  if (!isAuthReady) {
    return <LoadingSpinner />;
  }

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AnimatePresence mode="wait">
          <Suspense fallback={<LoadingSpinner />}>
            <Routes>
              {/* Auth */}
              <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
              <Route path="/signup" element={isAuthenticated ? <Navigate to="/" replace /> : <SignupPage />} />
              <Route path="/audiences" element={<AudiencePage />} />

              {/* App */}
              <Route path="/" element={isAuthenticated ? <FeedPage /> : <LandingPage />} />
              <Route path="/profile" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
              <Route path="/profile/:id" element={isAuthenticated ? <ProfilePage /> : <Navigate to="/login" replace />} />
              <Route path="/jobs" element={isAuthenticated ? <JobsPage /> : <Navigate to="/login" replace />} />
              <Route path="/network" element={isAuthenticated ? <NetworkPage /> : <Navigate to="/login" replace />} />
              <Route path="/messages" element={isAuthenticated ? <MessagesPage /> : <Navigate to="/login" replace />} />
              <Route path="/explore" element={isAuthenticated ? <ExplorePage /> : <Navigate to="/login" replace />} />
              <Route path="/companies" element={isAuthenticated ? <CompaniesPage /> : <Navigate to="/login" replace />} />

              <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/login" replace />} />
              <Route path="/forgot-password" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </AnimatePresence>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
