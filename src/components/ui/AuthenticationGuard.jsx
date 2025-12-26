import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const AuthenticationGuard = ({ children, requiredRoles = [] }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      setIsAuthenticated(false);
      setUserRole(null);
    }
  }, []);

  if (isAuthenticated === null) {
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
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRoles?.length > 0 && !requiredRoles?.includes(userRole)) {
    const redirectPath = userRole === 'student' ? '/student-dashboard' : '/faculty-dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default AuthenticationGuard;