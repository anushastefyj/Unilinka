import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import { useAuth } from '../../contexts/AuthContext';

const NavItem = ({ icon, label, path, isActive, onClick }) => (
  <Link 
    to={path} 
    onClick={onClick}
    className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
      isActive 
        ? 'bg-[#1F4D3A] text-white shadow-sm' 
        : 'text-[#5C5C5C] hover:bg-[#FAF7F0] hover:text-[#1C1C1C]'
    }`}
  >
    <Icon name={icon} size={20} className={isActive ? 'text-[#EFE7D8]' : 'text-[#5C5C5C]'} />
    <span>{label}</span>
  </Link>
);

const StudentLayout = ({ children, headerContent }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex h-screen bg-[#FAF7F0] overflow-hidden font-sans text-[#1C1C1C]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-[#E7E2D6]
        transform transition-transform duration-300 ease-in-out
        flex flex-col
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div 
          className="h-[88px] flex items-center px-8 border-b border-[#E7E2D6] cursor-pointer" 
          onClick={() => navigate('/student-dashboard')}
        >
          <h1 className="text-2xl font-bold text-[#1F4D3A] tracking-wider font-serif">UNILINKA</h1>
        </div>
        
        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          <NavItem 
            icon="LayoutDashboard" 
            label="Dashboard Home" 
            path="/student-dashboard" 
            isActive={location.pathname === '/student-dashboard'} 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <NavItem 
            icon="FileText" 
            label="Question Papers" 
            path="/question-papers" 
            isActive={location.pathname === '/question-papers'} 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <NavItem 
            icon="BookOpen" 
            label="Curriculum" 
            path="/curriculum" 
            isActive={location.pathname === '/curriculum'} 
            onClick={() => setIsSidebarOpen(false)} 
          />
          <NavItem 
            icon="Search" 
            label="Browse & Search" 
            path="/resource-browse" 
            isActive={location.pathname === '/resource-browse'} 
            onClick={() => setIsSidebarOpen(false)} 
          />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-[88px] bg-white border-b border-[#E7E2D6] flex items-center justify-between px-6 lg:px-10 z-10 flex-shrink-0 shadow-sm relative">
          <div className="flex items-center gap-4 w-full">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 rounded-xl text-[#1F4D3A] hover:bg-[#FAF7F0]"
            >
              <Icon name="Menu" size={24} />
            </button>
            
            {/* Injectable header content (like the mini search bar) */}
            <div className="w-full">
              {headerContent}
            </div>
          </div>
          
          {/* Avatar Profile Dropdown */}
          <div className="flex items-center gap-4 flex-shrink-0 relative" ref={dropdownRef}>
            <div className="hidden sm:block text-right">
              <p className="text-sm font-bold text-[#1C1C1C] leading-tight">{userData?.name || 'Student'}</p>
              <p className="text-xs text-[#5C5C5C]">{userData?.course || 'Enrolled'}</p>
            </div>
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="w-12 h-12 rounded-full bg-[#EFE7D8] border-2 border-white shadow-sm flex items-center justify-center text-[#1F4D3A] hover:scale-105 transition-transform"
            >
              <Icon name="User" size={20} />
            </button>
            
            {/* Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-56 bg-white border border-[#E7E2D6] rounded-2xl shadow-lg overflow-hidden animate-in fade-in slide-in-from-top-2">
                <div className="p-4 border-b border-[#E7E2D6] sm:hidden">
                  <p className="text-sm font-bold text-[#1C1C1C] truncate">{userData?.name || 'Student'}</p>
                  <p className="text-xs text-[#5C5C5C] truncate">{userData?.course || 'Enrolled'}</p>
                </div>
                <div className="p-2 flex flex-col gap-1">
                  <Link 
                    to="/profile" 
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#5C5C5C] hover:bg-[#FAF7F0] hover:text-[#1F4D3A] transition-colors"
                  >
                    <Icon name="User" size={16} />
                    View Profile
                  </Link>
                  <Link 
                    to="/settings"
                    onClick={() => setIsProfileDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#5C5C5C] hover:bg-[#FAF7F0] hover:text-[#1F4D3A] transition-colors"
                  >
                    <Icon name="Settings" size={16} />
                    Settings
                  </Link>
                  <div className="h-px bg-[#E7E2D6] my-1 mx-2" />
                  <button 
                    onClick={() => { logout(); navigate('/login'); }}
                    className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-bold text-[#5C5C5C] hover:bg-red-50 hover:text-red-600 transition-colors w-full text-left"
                  >
                    <Icon name="LogOut" size={16} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </header>

        {isOffline && (
          <div className="bg-amber-100 border-b border-amber-200 text-amber-800 text-sm font-bold px-6 py-2 flex items-center gap-2 z-20 flex-shrink-0 relative">
            <Icon name="WifiOff" size={16} />
            You're offline — showing cached resources only. Action requests are queued.
          </div>
        )}

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
