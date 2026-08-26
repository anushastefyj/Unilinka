import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginForm from './components/LoginForm';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/ui/AuthLayout';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);
  const { isAuthenticated, userData, loading } = useAuth();

  useEffect(() => {
    // If authenticated and user data is loaded, redirect
    if (isAuthenticated && userData && !loading) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        faculty: '/faculty-dashboard',
        admin: '/faculty-dashboard'
      };
      navigate(dashboardRoutes[userData.role] || '/student-dashboard');
    }

    // Check for registration success message
    if (location.state?.registrationSuccess && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location, isAuthenticated, userData, loading]);

  if (isAuthenticated && loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Login - Unilinka</title>
        <meta name="description" content="Sign in to Unilinka to access academic resources, share study materials, and collaborate with students and faculty." />
      </Helmet>
      
      <AuthLayout title="Login">
        {successMessage && (
          <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg flex items-start gap-3 bg-green-50 border border-green-200">
            <Icon name="CheckCircle" size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm md:text-base font-medium text-green-700">
                {successMessage}
              </p>
            </div>
            <button
              onClick={() => setSuccessMessage(null)}
              className="flex-shrink-0 text-green-700 hover:text-green-900"
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        )}
        
        <LoginForm initialEmail={location.state?.email} />
      </AuthLayout>
    </>
  );
};

export default Login;