import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import LoginHeader from './components/LoginHeader';
import LoginForm from './components/LoginForm';
import TrustSignals from './components/TrustSignals';
import Icon from '../../components/AppIcon';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (token && userRole) {
      const dashboardRoutes = {
        student: '/student-dashboard',
        faculty: '/faculty-dashboard',
        admin: '/faculty-dashboard'
      };
      navigate(dashboardRoutes?.[userRole] || '/student-dashboard');
    }

    // Check for registration success message
    if (location.state?.registrationSuccess && location.state?.message) {
      setSuccessMessage(location.state.message);
      // Pre-fill email if provided
      if (location.state.email) {
        // This will be handled in LoginForm
      }
      // Clear the state to prevent showing message on refresh
      window.history.replaceState({}, document.title);
    }
  }, [navigate, location]);

  return (
    <>
      <Helmet>
        <title>Login - LearnShare Platform</title>
        <meta name="description" content="Sign in to LearnShare to access academic resources, share study materials, and collaborate with students and faculty." />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center px-4 py-8 md:py-12 lg:py-16" style={{ background: 'var(--color-background)' }}>
        <div className="w-full max-w-md lg:max-w-lg">
          <div className="rounded-2xl shadow-academic-lg p-6 md:p-8 lg:p-10" style={{ background: 'var(--color-card)' }}>
            <LoginHeader />
            
            {successMessage && (
              <div className="mb-4 md:mb-6 p-3 md:p-4 rounded-lg flex items-start gap-3" style={{ 
                background: 'rgba(34, 197, 94, 0.1)',
                border: '1px solid rgba(34, 197, 94, 0.3)'
              }}>
                <Icon name="CheckCircle" size={20} color="rgb(34, 197, 94)" className="flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm md:text-base font-medium" style={{ color: 'rgb(34, 197, 94)' }}>
                    {successMessage}
                  </p>
                </div>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="flex-shrink-0"
                  style={{ color: 'rgb(34, 197, 94)' }}
                >
                  <Icon name="X" size={18} />
                </button>
              </div>
            )}
            
            <LoginForm initialEmail={location.state?.email} />
            <TrustSignals />
          </div>

          <div className="mt-6 md:mt-8 text-center">
            <p className="text-xs md:text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
              By signing in, you agree to our{' '}
              <button className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
                Terms of Service
              </button>
              {' '}and{' '}
              <button className="font-medium transition-colors" style={{ color: 'var(--color-primary)' }}>
                Privacy Policy
              </button>
            </p>
          </div>

          <div className="mt-4 md:mt-6 text-center">
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>
              &copy; {new Date()?.getFullYear()} LearnShare Platform. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;