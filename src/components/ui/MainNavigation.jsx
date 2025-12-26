import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';

const MainNavigation = ({ userRole = null, isAuthenticated = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location?.pathname]);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userRole');
    navigate('/login');
  };

  const getNavigationItems = () => {
    if (!isAuthenticated) {
      return [
        { label: 'Login', path: '/login', icon: 'LogIn', roles: null }
      ];
    }

    const baseItems = [
      { label: 'Browse Resources', path: '/resource-browse', icon: 'BookOpen', roles: ['student', 'faculty', 'admin'] },
      { label: 'Share Resource', path: '/resource-upload', icon: 'Upload', roles: ['student', 'faculty'] }
    ];

    const roleSpecificItems = {
      student: [
        { label: 'Dashboard', path: '/student-dashboard', icon: 'LayoutDashboard', roles: ['student'] }
      ],
      faculty: [
        { label: 'Dashboard', path: '/faculty-dashboard', icon: 'LayoutDashboard', roles: ['faculty'] }
      ],
      admin: [
        { label: 'Dashboard', path: '/faculty-dashboard', icon: 'LayoutDashboard', roles: ['admin'] }
      ]
    };

    const dashboardItems = userRole && roleSpecificItems?.[userRole] ? roleSpecificItems?.[userRole] : [];
    
    return [...dashboardItems, ...baseItems];
  };

  const navigationItems = getNavigationItems();
  const visibleItems = navigationItems?.filter(item => 
    !item?.roles || (userRole && item?.roles?.includes(userRole))
  );

  const isActivePath = (path) => {
    return location?.pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav className="main-navigation">
        <Link to={isAuthenticated ? (userRole === 'student' ? '/student-dashboard' : '/faculty-dashboard') : '/'} className="main-navigation-logo">
          <div className="main-navigation-logo-icon">
            <Icon name="GraduationCap" size={24} />
          </div>
          <span>LearnShare</span>
        </Link>

        <div className="main-navigation-menu">
          {visibleItems?.map((item) => (
            <Link
              key={item?.path}
              to={item?.path}
              className={`main-navigation-link ${isActivePath(item?.path) ? 'active' : ''}`}
            >
              <Icon name={item?.icon} size={20} />
              <span>{item?.label}</span>
            </Link>
          ))}
          {isAuthenticated && (
            <button
              onClick={handleLogout}
              className="main-navigation-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <Icon name="LogOut" size={20} />
              <span>Logout</span>
            </button>
          )}
        </div>

        <button
          className="main-navigation-mobile-toggle"
          onClick={toggleMobileMenu}
          aria-label="Toggle mobile menu"
        >
          <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={24} />
        </button>
      </nav>
      <div
        className={`main-navigation-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}
        onClick={closeMobileMenu}
      />
      <div className={`main-navigation-mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        {visibleItems?.map((item) => (
          <Link
            key={item?.path}
            to={item?.path}
            className={`main-navigation-mobile-link ${isActivePath(item?.path) ? 'active' : ''}`}
          >
            <Icon name={item?.icon} size={20} />
            <span>{item?.label}</span>
          </Link>
        ))}
        {isAuthenticated && (
          <button
            onClick={handleLogout}
            className="main-navigation-mobile-link"
            style={{ background: 'none', border: 'none', cursor: 'pointer', width: '100%', textAlign: 'left' }}
          >
            <Icon name="LogOut" size={20} />
            <span>Logout</span>
          </button>
        )}
      </div>
    </>
  );
};

export default MainNavigation;