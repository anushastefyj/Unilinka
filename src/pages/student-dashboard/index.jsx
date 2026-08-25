import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StatsCard from './components/StatsCard';
import RecentUploadCard from './components/RecentUploadCard';
import SubjectCategoryCard from './components/SubjectCategoryCard';
import RecommendedResourceCard from './components/RecommendedResourceCard';
import ActivityFeedItem from './components/ActivityFeedItem';

import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const { isAuthenticated, userData, logout } = useAuth();
  const userRole = userData?.role;

  const [stats, setStats] = useState({ shared: 0, approved: 0 });
  const [recentUploads, setRecentUploads] = useState([]);
  const [recommendedResources, setRecommendedResources] = useState([]);
  const [downloadsAccessed, setDownloadsAccessed] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userData?.id) return;
      setIsLoading(true);

      try {
        // Fetch user's own resources for stats and recent uploads
        const { data: myResources, error: myError } = await supabase
          .from('resources')
          .select('*')
          .eq('uploader_id', userData.id)
          .order('created_at', { ascending: false });

        if (!myError && myResources) {
          const approvedCount = myResources.filter(r => r.status === 'approved').length;
          setStats({ shared: myResources.length, approved: approvedCount });
          
          setRecentUploads(myResources.map(r => ({
            id: r.id,
            title: r.title,
            subject: r.subject,
            fileType: r.file_type?.toUpperCase(),
            uploadDate: r.created_at,
            status: r.status,
            downloads: r.download_count || 0,
            feedback: r.status === 'rejected' ? 'This resource did not meet our quality guidelines. Please revise and upload again.' : null
          })).slice(0, 5));
        }

        // Fetch recommended resources based on course/subject
        const { data: recData, error: recError } = await supabase
          .from('resources')
          .select('*, profiles:uploader_id(name)')
          .eq('status', 'approved')
          .neq('uploader_id', userData.id)
          .order('created_at', { ascending: false })
          .limit(3);

        if (!recError && recData) {
          setRecommendedResources(recData.map(r => ({
            id: r.id,
            title: r.title,
            subject: r.subject,
            fileType: r.file_type?.toUpperCase(),
            uploaderName: r.profiles?.name || 'Unknown',
            uploaderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b43e8b7f-1763295504724.png",
            uploaderAvatarAlt: 'User Avatar',
            uploadDate: r.created_at,
            downloads: r.download_count || 0,
            rating: 4.8
          })));
        }

        const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
        setDownloadsAccessed(history.length);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [userData]);

  const studentStats = [
    {
      id: 1,
      icon: 'Upload',
      label: 'Total Shared',
      value: stats.shared.toString(),
      trend: 'up',
      trendValue: '+0'
    },
    {
      id: 2,
      icon: 'Download',
      label: 'Total Downloads',
      value: downloadsAccessed.toString(),
      trend: 'up',
      trendValue: '+0'
    },
    {
      id: 3,
      icon: 'CheckCircle',
      label: 'Approved',
      value: stats.approved.toString(),
      trend: 'up',
      trendValue: '+0'
    }
  ];

  const subjectCategories = [
    {
      id: 'computer-science',
      name: 'Object oriented programming',
      description: 'Programming, algorithms, and structures',
      icon: 'Monitor',
      iconBg: 'bg-primary/20',
      resourceCount: 156,
      lastUpdated: '2 hours ago'
    },
    {
      id: 'database-systems',
      name: 'Fundamentals of database systems',
      description: 'SQL, normalization, and DBMS',
      icon: 'Database',
      iconBg: 'bg-primary/20',
      resourceCount: 124,
      lastUpdated: '5 hours ago'
    }
  ];

  const activityFeed = [
    {
      id: 1,
      type: 'collaboration',
      message: 'New study group formed for Advanced Database Management Systems - 12 students joined',
      timestamp: new Date(Date.now() - 14400000),
      userAvatar: null,
      userAvatarAlt: null
    },
    {
      id: 2,
      type: 'upload',
      message: 'Professor Smith uploaded a new syllabus for Calculus II',
      timestamp: new Date(Date.now() - 86400000),
      userAvatar: null,
      userAvatarAlt: null
    }
  ];

  const handleViewFeedback = (upload) => {
    setSelectedUpload(upload);
    setShowFeedbackModal(true);
  };

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery?.trim()) {
      navigate('/resource-browse', { state: { searchQuery } });
    }
  };

  const NavItem = ({ icon, label, path, isActive, onClick }) => (
    <Link 
      to={path} 
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
        isActive 
          ? 'bg-white/20 text-white shadow-sm backdrop-blur-sm' 
          : 'text-primary-foreground/80 hover:bg-white/10 hover:text-white'
      }`}
    >
      <Icon name={icon} size={20} className={isActive ? 'text-white' : 'text-primary-foreground/70'} />
      <span>{label}</span>
    </Link>
  );

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <div className="flex h-screen bg-background overflow-hidden font-body text-foreground">
        
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-50 w-64 bg-primary text-primary-foreground 
          transform transition-transform duration-300 ease-in-out
          flex flex-col m-0 lg:m-4 lg:rounded-[32px] overflow-hidden shadow-xl
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-8 flex items-center justify-center border-b border-white/10">
            <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md shadow-sm">
              <Icon name="GraduationCap" size={40} className="text-white" />
            </div>
          </div>
          
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            <NavItem icon="LayoutDashboard" label="Dashboard" path="/student-dashboard" isActive={location.pathname === '/student-dashboard'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="UploadCloud" label="Upload Resource" path="/resource-upload" isActive={location.pathname === '/resource-upload'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="Search" label="Browse" path="/resource-browse" isActive={location.pathname === '/resource-browse'} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="BookOpen" label="My Courses" path="#" isActive={false} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="FileText" label="Results" path="#" isActive={false} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="Bell" label="Notice" path="#" isActive={false} onClick={() => setIsSidebarOpen(false)} />
            <NavItem icon="Calendar" label="Schedule" path="#" isActive={false} onClick={() => setIsSidebarOpen(false)} />
          </nav>
          
          <div className="p-4 border-t border-white/10">
            <button 
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-3 px-4 py-3 w-full rounded-2xl text-primary-foreground/80 hover:bg-white/10 hover:text-white transition-all font-medium"
            >
              <Icon name="LogOut" size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col h-screen overflow-hidden bg-background">
          {/* Header */}
          <header className="flex items-center justify-between px-6 lg:px-10 py-6">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl bg-white shadow-sm text-foreground hover:bg-gray-50"
              >
                <Icon name="Menu" size={24} />
              </button>
              
              <form onSubmit={handleSearch} className="hidden md:block w-96">
                <div className="relative">
                  <input
                    type="search"
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white rounded-full py-3 pl-12 pr-6 text-sm shadow-sm border-none focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                </div>
              </form>
            </div>

            <div className="flex items-center gap-6">
              <button className="relative p-2 text-muted-foreground hover:text-foreground">
                <Icon name="Bell" size={24} />
                <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full border-2 border-background"></span>
              </button>
              
              <div className="flex items-center gap-3">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-bold text-foreground leading-tight">{userData?.name || 'Student'}</p>
                  <p className="text-xs text-muted-foreground">{userData?.course || '1st Year'}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden">
                  <img src="https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f0fdf4" alt="Avatar" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </header>

          {/* Scrollable Dashboard Content */}
          <div className="flex-1 overflow-y-auto px-6 lg:px-10 pb-10">
            
            {/* Hero Banner */}
            <div className="bg-gradient-to-r from-primary to-purple-400 rounded-[32px] p-8 md:p-10 mb-10 text-white relative overflow-hidden shadow-lg shadow-primary/20">
              <div className="relative z-10 max-w-xl">
                <p className="text-sm font-medium opacity-80 mb-2 tracking-wide uppercase">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
                <h1 className="text-3xl md:text-4xl font-bold mb-3">Welcome back, {userData?.name?.split(' ')[0] || 'Student'}!</h1>
                <p className="opacity-90 text-lg">Always stay updated in your student portal. Discover new resources uploaded by your peers today.</p>
              </div>
              <Icon name="GraduationCap" size={240} className="absolute -right-10 -bottom-20 opacity-10 rotate-[-15deg] pointer-events-none" />
              <Icon name="BookOpen" size={120} className="absolute right-40 -top-10 opacity-10 rotate-[15deg] pointer-events-none" />
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              
              {/* Left Column (Stats & Subjects) */}
              <div className="xl:col-span-2 space-y-10">
                
                {/* Stats Section */}
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-6">Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {studentStats.map(stat => (
                      <StatsCard key={stat.id} {...stat} />
                    ))}
                  </div>
                </section>

                {/* Enrolled Subjects */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Enrolled Courses</h2>
                    <button className="text-primary text-sm font-bold hover:underline">See all</button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {subjectCategories.map(subject => (
                      <SubjectCategoryCard key={subject.id} subject={subject} />
                    ))}
                  </div>
                </section>

                {/* Recent Uploads */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Recent Submissions</h2>
                    <button className="text-primary text-sm font-bold hover:underline">See all</button>
                  </div>
                  {isLoading ? (
                    <div className="animate-pulse bg-muted rounded-3xl h-[200px]"></div>
                  ) : recentUploads.length === 0 ? (
                    <div className="bg-white border border-border rounded-3xl p-8 text-center shadow-sm">
                      <p className="text-muted-foreground mb-4">You haven't uploaded any resources yet.</p>
                      <Button variant="outline" onClick={() => navigate('/resource-upload')}>Upload Your First Resource</Button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {recentUploads.map(upload => (
                        <RecentUploadCard
                          key={upload.id}
                          upload={upload}
                          onViewFeedback={handleViewFeedback}
                        />
                      ))}
                    </div>
                  )}
                </section>
                
              </div>

              {/* Right Column (Contributors & Notices) */}
              <div className="space-y-10">
                
                {/* Top Contributors */}
                <section>
                  <h2 className="text-xl font-bold text-foreground mb-6">Course Instructors</h2>
                  <div className="flex items-center gap-4 bg-white rounded-3xl p-6 shadow-sm border border-border">
                    {recommendedResources.slice(0, 3).map((res, i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary/30 to-purple-300 p-1">
                          <img 
                            src={`https://api.dicebear.com/7.x/notionists/svg?seed=${res.uploaderName}&backgroundColor=ffffff`} 
                            alt={res.uploaderName}
                            className="w-full h-full rounded-full bg-white object-cover"
                          />
                        </div>
                        <span className="text-xs font-medium text-foreground truncate w-16 text-center">{res.uploaderName.split(' ')[0]}</span>
                      </div>
                    ))}
                    {recommendedResources.length === 0 && (
                      <p className="text-sm text-muted-foreground">No instructors found.</p>
                    )}
                  </div>
                </section>

                {/* Daily Notice */}
                <section>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-foreground">Daily Notice</h2>
                    <button className="text-primary text-sm font-bold hover:underline">See all</button>
                  </div>
                  <div className="bg-white rounded-[32px] shadow-sm border border-border overflow-hidden">
                    <div className="p-6 space-y-6">
                      {activityFeed.map((activity, index) => (
                        <div key={activity.id} className={`${index !== activityFeed.length - 1 ? 'border-b border-border pb-6' : ''}`}>
                          <h4 className="font-bold text-sm text-foreground mb-1">
                            {activity.type === 'collaboration' ? 'Prelim payment due' : 'Exam schedule'}
                          </h4>
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                            {activity.message}
                          </p>
                          <button className="text-xs font-bold text-primary">See more</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </section>

              </div>
            </div>

          </div>
        </main>

        {/* Feedback Modal */}
        {showFeedbackModal && selectedUpload && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowFeedbackModal(false)} />
            <div className="relative bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold">Feedback</h3>
                <button onClick={() => setShowFeedbackModal(false)} className="text-muted-foreground hover:text-foreground">
                  <Icon name="X" size={24} />
                </button>
              </div>
              <p className="text-muted-foreground mb-6">{selectedUpload.feedback}</p>
              <Button variant="default" className="w-full rounded-xl py-3" onClick={() => navigate('/resource-upload')}>
                Upload Revised Version
              </Button>
            </div>
          </div>
        )}
      </div>
    </AuthenticationGuard>
  );
};

export default StudentDashboard;