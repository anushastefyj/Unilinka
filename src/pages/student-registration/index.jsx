import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import RegistrationForm from './components/RegistrationForm';
import { useAuth } from '../../contexts/AuthContext';
import AuthLayout from '../../components/ui/AuthLayout';

const StudentRegistration = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData, loading } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userData && !loading) {
      if (userData.role === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else {
        navigate('/faculty-dashboard', { replace: true });
      }
    }
  }, [navigate, isAuthenticated, userData, loading]);

  if (isAuthenticated && loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - Unilinka</title>
        <meta name="description" content="Create a student account on Unilinka to access academic resources and collaborate." />
      </Helmet>
      
      <AuthLayout title="Create your account">
        <RegistrationForm />
      </AuthLayout>
    </>
  );
};

export default StudentRegistration;