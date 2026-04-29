import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '../context/AuthContext';
import HeroSection from '../components/sections/HeroSection';
import FeaturesSection from '../components/sections/FeaturesSection';
import VisualsSection from '../components/sections/VisualsSection';
import CTASection from '../components/sections/CTASection';
import Footer from '../components/layout/Footer';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import Dashboard from '../pages/Dashboard';
import { PublicRoute, ProtectedRoute } from './authRoutes';

// Simple loading component
const LoadingIndicator: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f] flex items-center justify-center">
      <div className="text-center">
        <div className="h-8 w-8 border-4 border-t-purple-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-400">Loading...</p>
      </div>
    </div>
  );
};

function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gradient-to-r from-black to-[#2a003f]">
          {/* We'll handle loading state in the routes themselves */}
          <Routes>
            <Route path="/" element={
              <LoadingRoute>
                <>
                  <HeroSection />
                  <FeaturesSection />
                  <VisualsSection />
                  <CTASection />
                  <Footer />
                </>
              </LoadingRoute>
            } />
            
            {/* Auth routes (public when not logged in) */}
            <Route path="/login" element={<LoadingRoute><PublicRoute><LoginPage /></PublicRoute></LoadingRoute>} />
            <Route path="/signup" element={<LoadingRoute><PublicRoute><SignupPage /></PublicRoute></LoadingRoute>} />
            <Route path="/forgot-password" element={<LoadingRoute><PublicRoute><ForgotPasswordPage /></PublicRoute></LoadingRoute>} />
            <Route path="/reset-password" element={<LoadingRoute><PublicRoute><ResetPasswordPage /></PublicRoute></LoadingRoute>} />
            
            {/* Protected routes */}
            <Route path="/dashboard" element={<LoadingRoute><ProtectedRoute><Dashboard /></ProtectedRoute></LoadingRoute>} />
            {/* Add more protected routes here as they're implemented */}
            
            {/* Redirect root to home if not already there */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Wrapper component to handle loading state
const LoadingRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { loading } = useAuth();
  
  if (loading) {
    return <LoadingIndicator />;
  }
  
  return children;
};

export default AppRouter;