import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import StatsCard from './components/StatsCard';
import SubjectCategoryCard from './components/SubjectCategoryCard';
import RecentResourceCard from './components/RecentResourceCard';
import BranchCard from './components/BranchCard';
import SemesterTabs from './components/SemesterTabs';
import CurriculumList from './components/CurriculumList';
import QuestionPaperList from './components/QuestionPaperList';
import HeroWelcomeCard from './components/HeroWelcomeCard';
import SearchBar from './components/SearchBar';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ACADEMIC_YEARS, BRANCHES, HIERARCHICAL_CURRICULUM } from '../../config/curriculum';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userData, logout } = useAuth();
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  // Track State: 'home' | 'papers' | 'curriculum'
  const [currentTrack, setCurrentTrack] = useState('home');
  
  // Drill-Down State (shared logic but different presentation based on track)
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  
  const [searchQuery, setSearchQuery] = useState('');

  // Platform Stats & Resources
  const [platformStats, setPlatformStats] = useState({ total: 0, papers: 0, curriculum: 0 });
  const [recentResources, setRecentResources] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    fetchPlatformStats();
    fetchRecentResources();
    
    // Click outside handler for dropdown
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchPlatformStats = async () => {
    setIsLoadingStats(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title') 
        .eq('status', 'approved');

      if (!error && data) {
        const papers = data.filter(r => r.title.toLowerCase().includes('paper') || r.title.match(/(20\d{2})/)).length;
        setPlatformStats({
          total: data.length || 0,
          papers: papers || 0,
          curriculum: (data.length - papers) || 0
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentResources = async () => {
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, subject, academic_year, file_type, created_at, file_url, uploader_id')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(6);

      if (!error && data) {
        setRecentResources(data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description,
          subject: r.subject,
          academicYear: r.academic_year,
          fileType: r.file_type?.toUpperCase(),
          uploadDate: r.created_at,
          fileUrl: r.file_url,
        })));
      }
    } catch (error) {
      console.error("Error fetching recent resources:", error);
    }
  };

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

  const startTrack = (track) => {
    setCurrentTrack(track);
    setSelectedYear(null);
    setSelectedBranch(null);
    setSelectedSemester('Semester 1');
  };

  const resetToHome = () => {
    setCurrentTrack('home');
    setSelectedYear(null);
    setSelectedBranch(null);
    setSearchQuery('');
  };

  const getAvailableSubjects = () => {
    if (selectedYear && selectedBranch && selectedSemester) {
      return HIERARCHICAL_CURRICULUM[selectedYear]?.[selectedBranch]?.[selectedSemester] || [];
    }
    return [];
  };

  const renderDrillDown = () => {
    if (!selectedYear) {
      return (
        <section className="animate-in fade-in duration-300 max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">
              {currentTrack === 'papers' ? 'Question Papers' : 'Curriculum Resources'}
            </h2>
            <p className="text-[#5C5C5C]">Select your academic year to begin.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {ACADEMIC_YEARS.filter(y => y.id !== 'all').map(year => (
              <SubjectCategoryCard 
                key={year.id} 
                year={year} 
                isCurrentYear={userData?.year === year.value}
                onClick={() => setSelectedYear(year.value)}
              />
            ))}
          </div>
        </section>
      );
    }

    if (currentTrack === 'papers') {
      if (!selectedBranch) {
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedYear} Papers</h2>
            <p className="text-[#5C5C5C] mb-8">Select semester and branch</p>
            
            <SemesterTabs activeSemester={selectedSemester} onSemesterSelect={setSelectedSemester} />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
              {BRANCHES.map(branch => (
                <BranchCard key={branch.id} branch={branch} onClick={() => setSelectedBranch(branch.value)} />
              ))}
            </div>
          </section>
        );
      }

      return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
           <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedBranch} Papers</h2>
            <p className="text-[#5C5C5C]">{selectedYear} • {selectedSemester}</p>
          </div>
          <QuestionPaperList subjects={getAvailableSubjects()} selectedYear={selectedYear} />
        </section>
      );
    }

    if (currentTrack === 'curriculum') {
      if (!selectedBranch) {
        return (
          <section className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedYear} Curriculum</h2>
            <p className="text-[#5C5C5C] mb-8">Select your engineering branch</p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {BRANCHES.map(branch => (
                <BranchCard key={branch.id} branch={branch} onClick={() => setSelectedBranch(branch.value)} />
              ))}
            </div>
          </section>
        );
      }

      return (
        <section className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedBranch} Curriculum</h2>
            <p className="text-[#5C5C5C]">{selectedYear}</p>
          </div>
          
          <SemesterTabs activeSemester={selectedSemester} onSemesterSelect={setSelectedSemester} />
          
          <div className="mt-8">
            <CurriculumList subjects={getAvailableSubjects()} selectedYear={selectedYear} />
          </div>
        </section>
      );
    }
  };

  const getBreadcrumbs = () => {
    if (currentTrack === 'home') return null;
    
    const trackName = currentTrack === 'papers' ? 'Question Papers' : 'Curriculum';
    
    return (
      <div className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] bg-white py-3 px-6 rounded-full border border-[#E7E2D6] shadow-sm w-fit sticky top-0 z-20 overflow-x-auto whitespace-nowrap">
        <button onClick={resetToHome} className="hover:text-[#1F4D3A] transition-colors">
          Dashboard
        </button>
        <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
        <button onClick={() => startTrack(currentTrack)} className={`${!selectedYear ? 'text-[#1F4D3A]' : 'hover:text-[#1F4D3A] transition-colors'}`}>
          {trackName}
        </button>
        
        {selectedYear && (
          <>
            <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
            <button 
              onClick={() => { setSelectedBranch(null); }} 
              className={`${!selectedBranch ? 'text-[#1F4D3A]' : 'hover:text-[#1F4D3A] transition-colors'}`}
            >
              {selectedYear}
            </button>
          </>
        )}

        {selectedYear && selectedBranch && (
          <>
            <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
            {currentTrack === 'papers' && (
              <>
                <span className="text-[#5C5C5C]">{selectedSemester}</span>
                <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
              </>
            )}
            <span className="text-[#1F4D3A]">{selectedBranch}</span>
            {currentTrack === 'curriculum' && (
              <>
                <Icon name="ChevronRight" size={16} className="text-gray-400 flex-shrink-0" />
                <span className="text-[#1F4D3A]">{selectedSemester}</span>
              </>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <Helmet>
        <title>Dashboard - Unilinka</title>
      </Helmet>
      
      <div className="flex h-screen bg-[#FAF7F0] overflow-hidden font-sans text-[#1C1C1C]">
        
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
          <div className="h-[88px] flex items-center px-8 border-b border-[#E7E2D6] cursor-pointer" onClick={resetToHome}>
            <h1 className="text-2xl font-bold text-[#1F4D3A] tracking-wider font-serif">UNILINKA</h1>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <NavItem 
              icon="LayoutDashboard" 
              label="Dashboard Home" 
              path="/student-dashboard" 
              isActive={currentTrack === 'home'} 
              onClick={(e) => { e.preventDefault(); resetToHome(); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon="FileText" 
              label="Question Papers" 
              path="/student-dashboard" 
              isActive={currentTrack === 'papers'} 
              onClick={(e) => { e.preventDefault(); startTrack('papers'); setIsSidebarOpen(false); }} 
            />
            <NavItem 
              icon="BookOpen" 
              label="Curriculum" 
              path="/student-dashboard" 
              isActive={currentTrack === 'curriculum'} 
              onClick={(e) => { e.preventDefault(); startTrack('curriculum'); setIsSidebarOpen(false); }} 
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

        {/* Main Content */}
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
              
              <div className={`hidden md:block max-w-md w-full ml-4 transition-opacity ${currentTrack === 'home' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <div className="relative">
                  <Icon name="Search" size={16} className="absolute left-4 top-3 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Quick search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-[#1F4D3A]/30"
                  />
                </div>
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

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
            <div className="max-w-6xl mx-auto space-y-10">
              
              {getBreadcrumbs()}
              
              {currentTrack === 'home' && (
                <>
                  <SearchBar value={searchQuery} onChange={setSearchQuery} />
                  
                  <HeroWelcomeCard 
                    userName={userData?.name?.split(' ')[0]} 
                    onBrowsePapers={() => startTrack('papers')}
                    onBrowseCurriculum={() => startTrack('curriculum')}
                  />
                  
                  {/* Platform Stats Row */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <StatsCard 
                      icon="Database" 
                      label="Total Resources" 
                      value={platformStats.total} 
                      onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} 
                    />
                    <StatsCard 
                      icon="FileText" 
                      label="Question Papers" 
                      value={platformStats.papers} 
                      onClick={() => startTrack('papers')} 
                    />
                    <StatsCard 
                      icon="BookOpen" 
                      label="Curriculum Docs" 
                      value={platformStats.curriculum} 
                      onClick={() => startTrack('curriculum')} 
                    />
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Recently Added */}
                    <div className="lg:col-span-2">
                      <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif">Recently Added to Library</h2>
                      <div className="space-y-4">
                        {recentResources.map(resource => (
                          <RecentResourceCard key={resource.id} resource={resource} />
                        ))}
                      </div>
                    </div>
                    
                    {/* Right: Recommended */}
                    <div className="lg:col-span-1">
                      <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif">Recommended For You</h2>
                      <div className="bg-white rounded-[2rem] p-6 border border-[#E7E2D6] shadow-sm">
                        <div className="w-12 h-12 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] mb-4">
                          <Icon name="Compass" size={24} />
                        </div>
                        <h3 className="text-base font-bold text-[#1C1C1C] mb-2">Based on your profile</h3>
                        <p className="text-sm text-[#5C5C5C] mb-4">We noticed you are in {userData?.year || 'Year 1'}. Check out these top resources for your current semester.</p>
                        <button 
                          onClick={() => {
                            setSelectedYear(userData?.year || 'Year 1');
                            setCurrentTrack('curriculum');
                          }}
                          className="w-full text-center bg-[#FAF7F0] hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white border border-[#E7E2D6] hover:border-[#1F4D3A] py-2.5 rounded-xl font-bold text-sm transition-colors"
                        >
                          View My Curriculum
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Dynamic Drill Down Tracks */}
              {currentTrack !== 'home' && renderDrillDown()}
              
            </div>
          </div>
        </main>
      </div>
    </AuthenticationGuard>
  );
};

export default StudentDashboard;