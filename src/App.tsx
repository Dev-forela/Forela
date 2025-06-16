import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BottomNavProvider } from './context/BottomNavContext';
import { Layout } from './components/layout/Layout';
import SignIn from './components/auth/SignIn';
import SignUp from './components/auth/SignUp';
import EmailConfirmation from './components/auth/EmailConfirmation';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Journal from './pages/Journal';
import MyProfile from './pages/MyProfile';
import Home from './pages/Home';
import Companion from './pages/Companion';
import Trends from './pages/Trends';
import Settings from './pages/Settings';

const App: React.FC = () => {
  return (
    <Router>
      <AuthProvider>
        <BottomNavProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm-email" element={<EmailConfirmation />} />

            {/* Protected routes with Layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<MyProfile />} />
              <Route path="journal" element={<Journal />} />
              <Route path="profile" element={<MyProfile />} />
              <Route path="companion" element={<Companion />} />
              <Route path="trends" element={<Trends />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BottomNavProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
