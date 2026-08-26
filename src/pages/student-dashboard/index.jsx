import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import StatsCard from './components/StatsCard';
import SubjectCategoryCard from './components/SubjectCategoryCard';
import RecentResourceCard from './components/RecentResourceCard';
import BranchCard from './components/BranchCard';
import SemesterTabs from './components/SemesterTabs';
import CurriculumList from './components/CurriculumList';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import PDFUploadModal from '../../components/ui/PDFUploadModal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ACADEMIC_YEARS, BRANCHES, HIERARCHICAL_CURRICULUM } from '../../config/curriculum';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  
  const { isAuthenticated, userData, logout } = useAuth();
  
  // Dashboard Drill-Down State
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('Semester 1'); // default

  // Stats & Resources State
  const [stats, setStats] = useState({ shared: 0, pending: 0, approved: 0, rejected: 0 });
  const [recentResources, setRecentResources] = useState([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingResources, setIsLoadingResources] = useState(true);

  const fetchStats = async () => {
    if (!userData?.id) return;
    setIsLoadingStats(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('status')
        .eq('uploader_id', userData.id);

      if (!error && data) {
        setStats({
          shared: data.length,
          pending: data.filter(r => r.status === 'pending').length,
          approved: data.filter(r => r.status === 'approved').length,
          rejected: data.filter(r => r.status === 'rejected').length,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchRecentResources = async () => {
    setIsLoadingResources(true);
    try {
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, subject, academic_year, file_type, created_at, file_url, uploader_id, status')
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(5);

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
          uploaderId: r.uploader_id,
          status: r.status
        })));
      }
    } catch (error) {
      console.error("Error fetching recent resources:", error);
    } finally {
      setIsLoadingResources(false);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchRecentResources();
  }, [userData]);

  const handleUploadSuccess = () => {
    fetchStats();
    // We don't fetch recent resources because uploads go to pending and won't appear in the "Recently Added" approved list.
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

  const getAvailableSubjects = () => {
    if (selectedYear && selectedBranch && selectedSemester) {
      return HIERARCHICAL_CURRICULUM[selectedYear]?.[selectedBranch]?.[selectedSemester] || [];
    }
    return [];
  };

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <Helmet>
        <title>Dashboard - Unilinka</title>
      </Helmet>
      
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
          <div className="h-[88px] flex items-center px-8 border-b border-[#E7E2D6]">
            <h1 className="text-2xl font-bold text-[#1F4D3A] tracking-wider font-serif">UNILINKA</h1>
          </div>
          
          <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
            <NavItem icon="LayoutDashboard" label="Dashboard" path="/student-dashboard" isActive={location.pathname === '/student-dashboard'} onClick={() => setIsSidebarOpen(false)} />
            <button 
              onClick={() => { setIsUploadModalOpen(true); setIsSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm text-[#5C5C5C] hover:bg-[#FAF7F0] hover:text-[#1C1C1C]"
            >
              <Icon name="UploadCloud" size={20} className="text-[#5C5C5C]" />
              <span>Upload Resource</span>
            </button>
            <NavItem icon="Search" label="Browse All" path="/resource-browse" isActive={location.pathname === '/resource-browse'} onClick={() => setIsSidebarOpen(false)} />
          </nav>
          
          <div className="p-6 border-t border-[#E7E2D6]">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-[#5C5C5C] hover:bg-red-50 hover:text-red-700 transition-colors font-bold text-sm"
            >
              <Icon name="LogOut" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden">
          {/* Header */}
          <header className="h-[88px] bg-white border-b border-[#E7E2D6] flex items-center justify-between px-6 lg:px-10 z-10 flex-shrink-0 shadow-sm">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 rounded-xl text-[#1F4D3A] hover:bg-[#FAF7F0]"
              >
                <Icon name="Menu" size={24} />
              </button>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-bold text-[#1C1C1C] leading-tight">{userData?.name || 'Student'}</p>
                <p className="text-xs text-[#5C5C5C]">{userData?.course || 'Enrolled'}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-[#EFE7D8] border-2 border-white shadow-sm flex items-center justify-center text-[#1F4D3A]">
                <Icon name="User" size={20} />
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6 lg:p-10 relative">
            <div className="max-w-6xl mx-auto space-y-10">
              
              {/* Hero Section (only show if not drilled down) */}
              {!selectedYear && (
                <section className="bg-white rounded-[2rem] p-8 lg:p-12 border border-[#E7E2D6] shadow-sm relative overflow-hidden flex flex-col md:flex-row items-center justify-between">
                  <div className="relative z-10 max-w-xl">
                    <h1 className="text-3xl lg:text-4xl font-bold text-[#1C1C1C] mb-3 font-serif">
                      Welcome back, {userData?.name?.split(' ')[0] || 'Student'}
                    </h1>
                    <p className="text-[#5C5C5C] mb-8 text-base leading-relaxed">
                      Explore resources, share knowledge, and stay connected with your academic community.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-4">
                      <button 
                        onClick={() => setIsUploadModalOpen(true)}
                        className="bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white px-8 py-3.5 rounded-full font-bold text-sm transition-colors shadow-sm flex items-center gap-2"
                      >
                        <Icon name="UploadCloud" size={18} />
                        Upload Resource
                      </button>
                    </div>
                  </div>
                  {/* Decorative Illustration (using signup wave if available or login peek) */}
                  <div className="hidden md:block w-48 h-48 relative z-10 mr-8">
                     <img 
                      src="/signup-wave.jpg" 
                      alt="Student" 
                      className="w-full h-full object-cover rounded-full shadow-sm border-4 border-[#FAF7F0]" 
                    />
                  </div>
                </section>
              )}

              {/* Drill-down Breadcrumbs */}
              {selectedYear && (
                <div className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] bg-white py-3 px-6 rounded-full border border-[#E7E2D6] shadow-sm w-fit sticky top-0 z-20">
                  <button onClick={() => { setSelectedYear(null); setSelectedBranch(null); }} className="hover:text-[#1F4D3A] transition-colors">
                    Dashboard
                  </button>
                  <Icon name="ChevronRight" size={16} className="text-gray-400" />
                  <span className={`${!selectedBranch ? 'text-[#1F4D3A]' : 'cursor-pointer hover:text-[#1F4D3A] transition-colors'}`} onClick={() => setSelectedBranch(null)}>
                    {selectedYear}
                  </span>
                  
                  {selectedBranch && (
                    <>
                      <Icon name="ChevronRight" size={16} className="text-gray-400" />
                      <span className="text-[#1F4D3A]">{selectedBranch}</span>
                    </>
                  )}
                </div>
              )}

              {/* View 1: Select Year (Home) */}
              {!selectedYear && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Left Column: Academic Years (Primary Navigation) */}
                  <div className="lg:col-span-2">
                    <section>
                      <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif">Browse by Academic Year</h2>
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

                    <section className="mt-12">
                      <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif">Recently Added Resources</h2>
                      
                      {isLoadingResources ? (
                        <div className="space-y-4">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="animate-pulse bg-white border border-[#E7E2D6] rounded-2xl h-24 w-full" />
                          ))}
                        </div>
                      ) : recentResources.length === 0 ? (
                        <div className="bg-white border border-[#E7E2D6] rounded-[2rem] p-10 text-center shadow-sm">
                          <div className="w-20 h-20 rounded-full bg-[#FAF7F0] flex items-center justify-center mx-auto mb-4 text-[#1F4D3A]">
                            <Icon name="Inbox" size={32} />
                          </div>
                          <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No resources available yet</h3>
                          <p className="text-sm text-[#5C5C5C] mb-6 max-w-sm mx-auto">
                            Be one of the first students to contribute study material for your academic community.
                          </p>
                          <button onClick={() => setIsUploadModalOpen(true)} className="bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white px-8 py-3 rounded-full text-sm font-bold transition-colors">
                            Upload a resource
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {recentResources.map(resource => (
                            <RecentResourceCard key={resource.id} resource={resource} />
                          ))}
                        </div>
                      )}
                    </section>
                  </div>

                  {/* Right Column: Your Statistics */}
                  <div className="lg:col-span-1">
                    <section>
                      <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif">Your Contributions</h2>
                      
                      {isLoadingStats ? (
                        <div className="space-y-4">
                          {[1, 2, 3, 4].map(i => (
                            <div key={i} className="animate-pulse bg-white border border-[#E7E2D6] rounded-full h-16 w-full" />
                          ))}
                        </div>
                      ) : stats.shared === 0 ? (
                        <div className="bg-white border border-[#E7E2D6] rounded-[2rem] p-8 text-center shadow-sm">
                          <div className="w-16 h-16 rounded-full bg-[#EFE7D8] flex items-center justify-center mx-auto mb-4 text-[#1F4D3A]">
                            <Icon name="UploadCloud" size={28} />
                          </div>
                          <h3 className="text-base font-bold text-[#1C1C1C] mb-2">No uploads yet</h3>
                          <p className="text-sm text-[#5C5C5C] mb-6">Upload notes or presentations to help your peers learn.</p>
                          <button onClick={() => setIsUploadModalOpen(true)} className="text-sm font-bold text-[#1F4D3A] hover:underline">
                            Upload your first resource
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <StatsCard icon="UploadCloud" label="Resources Shared" value={stats.shared} />
                          <StatsCard icon="CheckCircle" label="Approved" value={stats.approved} />
                          <StatsCard icon="Clock" label="Pending Review" value={stats.pending} />
                          {stats.rejected > 0 && (
                            <StatsCard icon="XCircle" label="Rejected" value={stats.rejected} />
                          )}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              )}

              {/* View 2: Select Branch */}
              {selectedYear && !selectedBranch && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                  <div className="mb-8">
                    <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedYear}</h2>
                    <p className="text-[#5C5C5C]">Select your engineering branch to view the curriculum.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {BRANCHES.map(branch => (
                      <BranchCard 
                        key={branch.id} 
                        branch={branch} 
                        onClick={() => setSelectedBranch(branch.value)} 
                      />
                    ))}
                  </div>
                </section>
              )}

              {/* View 3: Select Semester & Curriculum */}
              {selectedYear && selectedBranch && (
                <section className="animate-in fade-in slide-in-from-bottom-4 duration-300 max-w-4xl mx-auto">
                  <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-[#1C1C1C] font-serif mb-2">{selectedBranch} Curriculum</h2>
                    <p className="text-[#5C5C5C]">{selectedYear}</p>
                  </div>

                  <SemesterTabs 
                    activeSemester={selectedSemester} 
                    onSemesterSelect={setSelectedSemester} 
                  />

                  <div className="mt-8">
                    <CurriculumList 
                      subjects={getAvailableSubjects()} 
                      selectedYear={selectedYear}
                    />
                  </div>
                </section>
              )}
              
            </div>
          </div>
        </main>
      </div>

      <PDFUploadModal 
        isOpen={isUploadModalOpen} 
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        initialContext={{
          year: selectedYear,
          branch: selectedBranch,
          semester: selectedSemester
        }}
      />
    </AuthenticationGuard>
  );
};

export default StudentDashboard;