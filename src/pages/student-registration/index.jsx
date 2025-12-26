import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import RegistrationHeader from './components/RegistrationHeader';
import RegistrationForm from './components/RegistrationForm';
import SecurityFeatures from './components/SecurityFeatures';

const StudentRegistration = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole');

    if (authToken && userRole) {
      if (userRole === 'student') {
        navigate('/student-dashboard', { replace: true });
      } else if (userRole === 'faculty' || userRole === 'admin') {
        navigate('/faculty-dashboard', { replace: true });
      }
    }
  }, [navigate]);

  return (
    <div className="min-h-screen" style={{ background: 'var(--color-background)' }}>
      <MainNavigation isAuthenticated={false} />
      
      <div className="pt-20 md:pt-24 pb-12 md:pb-16 lg:pb-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div 
            className="rounded-xl md:rounded-2xl lg:rounded-3xl p-6 md:p-8 lg:p-10 shadow-academic-lg"
            style={{ background: 'var(--color-card)' }}
          >
            <RegistrationHeader />
            <RegistrationForm />
          </div>
          
          <SecurityFeatures />
        </div>
      </div>
    </div>
  );
};

export default StudentRegistration;