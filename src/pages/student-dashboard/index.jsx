import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ACADEMIC_YEARS, BRANCHES, HIERARCHICAL_CURRICULUM } from '../../config/curriculum';

const StudentDashboard = () => {
  const { userData } = useAuth();
  const location = useLocation();
  
  // Track State: 'home' | 'papers' | 'curriculum'
  const [currentTrack, setCurrentTrack] = useState(() => {
    if (location.pathname === '/question-papers') return 'papers';
    if (location.pathname === '/curriculum') return 'curriculum';
    return 'home';
  });
  
  // Drill-Down State 
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [selectedSemester, setSelectedSemester] = useState('Semester 1');
  
  const [searchQuery, setSearchQuery] = useState('');

  // Advanced Features State
  const [lastVisited, setLastVisited] = useState(null);

  // Platform Stats & Resources
  const [platformStats, setPlatformStats] = useState({ total: 0, papers: 0, curriculum: 0 });
  const [recentResources, setRecentResources] = useState([]);
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (location.pathname === '/question-papers') setCurrentTrack('papers');
    else if (location.pathname === '/curriculum') setCurrentTrack('curriculum');
    else setCurrentTrack('home');
    
    // Reset drill-down state on route change
    setSelectedYear(null);
    setSelectedBranch(null);
    setSearchQuery('');
    
    // Check last visited
    const storedLastVisited = localStorage.getItem('unilinka_last_visited');
    if (storedLastVisited) {
      try {
        setLastVisited(JSON.parse(storedLastVisited));
      } catch (e) {
        console.error(e);
      }
    }
    
    // Check progress for readiness score
    const storedProgress = localStorage.getItem('unilinka_progress');
    if (storedProgress) {
      try {
        setProgress(JSON.parse(storedProgress));
      } catch (e) {
        console.error(e);
      }
    }
  }, [location.pathname]);

  useEffect(() => {
    fetchPlatformStats();
    fetchRecentResources();
  }, []);

  const fetchPlatformStats = async () => {
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

  const getExamReadinessScore = (subject) => {
    const topics = [
      { title: `Introduction to ${subject}`, priority: 'Medium' },
      { title: `Core Principles of ${subject}`, priority: 'High' },
      { title: `Advanced Concepts`, priority: 'High' },
      { title: `Practical Applications`, priority: 'Medium' },
      { title: `Previous Year Case Studies`, priority: 'Low' }
    ];
    const completedTopicsCount = (progress[subject] || []).length;
    const totalHighPriority = topics.filter(t => t.priority === 'High').length;
    const completedHighPriority = (progress[subject] || []).filter(i => topics[i].priority === 'High').length;
    
    const syllabusPercentage = topics.length > 0 ? (completedTopicsCount / topics.length) : 0;
    const highPriorityPercentage = totalHighPriority > 0 ? (completedHighPriority / totalHighPriority) : 0;
    
    return Math.round(((syllabusPercentage + highPriorityPercentage) / 2) * 100);
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
      <div className="flex items-center gap-2 text-sm font-bold text-[#5C5C5C] bg-white py-3 px-6 rounded-full border border-[#E7E2D6] shadow-sm w-fit sticky top-0 z-20 overflow-x-auto whitespace-nowrap mb-10">
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

  const headerSearch = (
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
  );

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <Helmet>
        <title>Dashboard - Unilinka</title>
      </Helmet>
      
      <StudentLayout headerContent={headerSearch}>
        {getBreadcrumbs()}
        
        {currentTrack === 'home' && (
          <div className="space-y-10">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            
            {/* Last Visited Widget & Readiness Score */}
            {lastVisited && (
              <div className="bg-[#EFE7D8] text-[#1F4D3A] p-6 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1 flex items-center gap-2">
                      <Icon name="History" size={20} />
                      Current Focus: {lastVisited.subject}
                    </h3>
                    <p className="text-sm opacity-80">Pick up where you left off in your curriculum.</p>
                  </div>
                  <div className="bg-white/50 px-4 py-3 rounded-lg flex items-center gap-4 min-w-[200px]">
                    <div className="flex-1">
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-bold">Exam Readiness</span>
                        <span className="text-xs font-bold">{getExamReadinessScore(lastVisited.subject)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#E7E2D6] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#1F4D3A] transition-all duration-500 rounded-full"
                          style={{ width: `${getExamReadinessScore(lastVisited.subject)}%` }}
                        />
                      </div>
                    </div>
                    <button onClick={() => startTrack('curriculum')} className="p-2 bg-[#1F4D3A] text-white rounded-md hover:bg-[#153a2b] transition-colors">
                      <Icon name="ChevronRight" size={16} />
                    </button>
                  </div>
                </div>
              </div>
            )}
            
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
            
            {/* Trending Section */}
            {recentResources.length > 0 && (() => {
              // Mock sorting by downloads
              const trendingItems = [...recentResources]
                .map(r => ({ ...r, mockDownloads: ((r.id?.toString().charCodeAt(0) || 1) * 17) % 200 + 20 }))
                .sort((a, b) => b.mockDownloads - a.mockDownloads)
                .slice(0, 5);
              
              const isWeeklySparse = trendingItems.length < 3;
              const trendingTitle = isWeeklySparse ? "Trending This Month" : "Trending This Week";

              return (
                <div>
                  <h2 className="text-xl font-bold text-[#1C1C1C] mb-6 font-serif flex items-center gap-2">
                    <Icon name="TrendingUp" size={20} className="text-[#1F4D3A]" />
                    {trendingTitle}
                  </h2>
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
                    {trendingItems.map(resource => (
                      <div key={resource.id} className="min-w-[300px] w-[300px] bg-white border border-[#E7E2D6] rounded-2xl p-5 shadow-sm hover:shadow-md transition-all flex flex-col gap-3 justify-between">
                        <div>
                          <div className="flex items-start justify-between mb-3">
                            <div className="bg-[#EFE7D8] rounded-xl p-2">
                              <Icon name="FileText" size={20} className="text-[#1F4D3A]" />
                            </div>
                            <span className="text-xs font-bold text-[#1F4D3A] bg-[#FAF7F0] px-2 py-1 rounded-md border border-[#E7E2D6]">
                              {resource.mockDownloads} downloads
                            </span>
                          </div>
                          <h3 className="text-sm font-bold text-[#1C1C1C] line-clamp-2 leading-snug mb-2" title={resource.title}>{resource.title}</h3>
                        </div>
                        <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-bold text-[#5C5C5C] uppercase tracking-wider">
                          <span className="bg-[#FAF7F0] px-2 py-1 rounded border border-[#E7E2D6] truncate max-w-[100px]">{resource.subject}</span>
                          <span className="bg-[#FAF7F0] px-2 py-1 rounded border border-[#E7E2D6]">{resource.academicYear}</span>
                          <span className="bg-[#FAF7F0] px-2 py-1 rounded border border-[#E7E2D6]">CSE</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}

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
          </div>
        )}

        {/* Dynamic Drill Down Tracks */}
        {currentTrack !== 'home' && renderDrillDown()}
      </StudentLayout>
    </AuthenticationGuard>
  );
};

export default StudentDashboard;