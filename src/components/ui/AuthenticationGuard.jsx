import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AuthenticationGuard = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, userData, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'var(--color-background)'
      }}>
        <div style={{
          width: '48px',
          height: '48px',
          border: '4px solid var(--color-muted)',
          borderTopColor: 'var(--color-primary)',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
      </div>
    );
  }

  if (!isAuthenticated) {
    // return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRole = userData?.role;

  if (requiredRoles?.length > 0 && (!userRole || !requiredRoles.includes(userRole))) {
    const redirectPath = userRole === 'student' ? '/student-dashboard' : '/faculty-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthenticationGuard;