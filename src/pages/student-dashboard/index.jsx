import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import StatsCard from './components/StatsCard';
import RecentUploadCard from './components/RecentUploadCard';
import SubjectCategoryCard from './components/SubjectCategoryCard';
import RecommendedResourceCard from './components/RecommendedResourceCard';
import ActivityFeedItem from './components/ActivityFeedItem';
import QuickActionCard from './components/QuickActionCard';

import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  
  const { isAuthenticated, userData } = useAuth();
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
          })).slice(0, 5)); // show latest 5
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
            rating: 4.8 // Dummy rating
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
    icon: 'Upload',
    label: 'Resources Shared',
    value: stats.shared.toString(),
    trend: 'up',
    trendValue: '+0',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    icon: 'Download',
    label: 'Downloads Accessed',
    value: downloadsAccessed.toString(),
    trend: 'up',
    trendValue: '+0',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    icon: 'CheckCircle',
    label: 'Approved Resources',
    value: stats.approved.toString(),
    trend: 'up',
    trendValue: '+0',
    iconBgColor: 'bg-green-100 dark:bg-green-900'
  },
  {
    icon: 'Users',
    label: 'Community Engagement',
    value: '85%',
    trend: 'up',
    trendValue: '+5%',
    iconBgColor: 'bg-amber-100 dark:bg-amber-900'
  }];

  const subjectCategories = [
  {
    id: 'computer-science',
    name: 'Computer Science',
    description: 'Programming, algorithms, data structures, and software engineering resources',
    icon: 'Code',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    resourceCount: 156,
    lastUpdated: '2 hours ago'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Calculus, algebra, statistics, and mathematical analysis materials',
    icon: 'Calculator',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    resourceCount: 124,
    lastUpdated: '5 hours ago'
  },
  {
    id: 'physics',
    name: 'Physics',
    description: 'Classical mechanics, quantum physics, and experimental physics notes',
    icon: 'Atom',
    iconBg: 'bg-green-100 dark:bg-green-900',
    resourceCount: 98,
    lastUpdated: '1 day ago'
  },
  {
    id: 'chemistry',
    name: 'Chemistry',
    description: 'Organic, inorganic, physical chemistry, and laboratory procedures',
    icon: 'FlaskConical',
    iconBg: 'bg-amber-100 dark:bg-amber-900',
    resourceCount: 87,
    lastUpdated: '3 hours ago'
  }];

  const activityFeed = [
  {
    id: 1,
    type: 'collaboration',
    message: 'New study group formed for Advanced Database Management Systems - 12 students joined',
    timestamp: new Date(Date.now() - 14400000),
    userAvatar: null,
    userAvatarAlt: null
  }];

  const quickActions = [
  {
    id: 1,
    title: 'Share Resource',
    description: 'Upload study materials to help your peers and contribute to the community',
    icon: 'Upload',
    iconBg: 'bg-blue-100 dark:bg-blue-900',
    actionText: 'Upload Now',
    path: '/resource-upload'
  },
  {
    id: 2,
    title: 'Browse Resources',
    description: 'Explore verified academic materials across all subjects',
    icon: 'BookOpen',
    iconBg: 'bg-purple-100 dark:bg-purple-900',
    actionText: 'Start Browsing',
    path: '/resource-browse'
  }];


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

  return (
    <AuthenticationGuard requiredRoles={['student']}>
      <div className="min-h-screen bg-background">
        <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
      <main className="pt-16 md:pt-20 pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Welcome Back, {userData?.name || 'Student'}!
                </h1>
                <p className="text-sm md:text-base text-muted-foreground">
                  Your collaborative learning dashboard for academic success
                </p>
              </div>
              
              <Button
                variant="default"
                size="lg"
                iconName="Upload"
                iconPosition="left"
                onClick={() => navigate('/resource-upload')}
                className="w-full lg:w-auto">

                Share Resource
              </Button>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Input
                  type="search"
                  placeholder="Search for resources, subjects, or topics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e?.target?.value)}
                  className="pr-12" />

                <button
                  type="submit"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-academic">

                  <Icon name="Search" size={20} />
                </button>
              </div>
            </form>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10">
            {studentStats?.map((stat, index) =>
            <StatsCard key={index} {...stat} />
            )}
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 lg:mb-10">
            {quickActions?.map((action) =>
            <QuickActionCard key={action?.id} action={action} />
            )}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Left Column - Recent Uploads & Subject Categories */}
            <div className="lg:col-span-2 space-y-6 md:space-y-8">
              {/* Recent Uploads */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    Your Submissions
                  </h2>
                </div>
                
                {isLoading ? (
                  <div className="animate-pulse bg-muted rounded-xl h-[200px]"></div>
                ) : recentUploads.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-8 text-center">
                    <p className="text-muted-foreground mb-4">You haven't uploaded any resources yet.</p>
                    <Button variant="outline" onClick={() => navigate('/resource-upload')}>Upload Your First Resource</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:gap-5">
                    {recentUploads?.map((upload) =>
                    <RecentUploadCard
                      key={upload?.id}
                      upload={upload}
                      onViewFeedback={handleViewFeedback} />
                    )}
                  </div>
                )}
              </section>

              {/* Subject Categories */}
              <section>
                <div className="flex items-center justify-between mb-4 md:mb-6">
                  <h2 className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                    Browse by Subject
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 lg:gap-6">
                  {subjectCategories?.map((subject) =>
                  <SubjectCategoryCard key={subject?.id} subject={subject} />
                  )}
                </div>
              </section>
            </div>

            {/* Right Column - Recommended Resources & Activity Feed */}
            <div className="space-y-6 md:space-y-8">
              {/* Recommended Resources */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
                  Recommended for You
                </h2>
                
                {isLoading ? (
                  <div className="animate-pulse bg-muted rounded-xl h-[300px]"></div>
                ) : recommendedResources.length === 0 ? (
                  <div className="bg-card border border-border rounded-xl p-4 text-center">
                    <p className="text-muted-foreground">Check back later for recommendations.</p>
                  </div>
                ) : (
                  <div className="space-y-4 md:space-y-5">
                    {recommendedResources?.map((resource) =>
                    <RecommendedResourceCard key={resource?.id} resource={resource} />
                    )}
                  </div>
                )}
              </section>

              {/* Activity Feed */}
              <section>
                <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4 md:mb-6">
                  Recent Activity
                </h2>
                
                <div className="bg-card border border-border rounded-xl p-2 md:p-3 shadow-academic">
                  <div className="space-y-1">
                    {activityFeed?.map((activity) =>
                    <ActivityFeedItem key={activity?.id} activity={activity} />
                    )}
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
      {/* Feedback Modal */}
      {showFeedbackModal && selectedUpload &&
      <>
          <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
          onClick={() => setShowFeedbackModal(false)} />

          
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-card border border-border rounded-xl shadow-academic-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 md:p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground mb-2">
                      Faculty Feedback
                    </h3>
                    <p className="text-sm md:text-base text-muted-foreground">
                      {selectedUpload?.title}
                    </p>
                  </div>
                  <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="text-muted-foreground hover:text-foreground transition-academic">

                    <Icon name="X" size={24} />
                  </button>
                </div>

                <div className="bg-error/10 border border-error/20 rounded-lg p-4 md:p-6 mb-6">
                  <div className="flex items-start gap-3 mb-4">
                    <Icon name="AlertCircle" size={24} className="text-error flex-shrink-0" />
                    <div>
                      <h4 className="text-base md:text-lg font-semibold text-error mb-2">
                        Resource Rejected
                      </h4>
                      <p className="text-sm md:text-base text-foreground">
                        {selectedUpload?.feedback}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                  variant="default"
                  iconName="Upload"
                  iconPosition="left"
                  onClick={() => {
                    setShowFeedbackModal(false);
                    navigate('/resource-upload');
                  }}
                  className="flex-1">

                    Upload Revised Version
                  </Button>
                  <Button
                  variant="outline"
                  onClick={() => setShowFeedbackModal(false)}
                  className="flex-1">

                    Close
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </div>
    </AuthenticationGuard>
  );

};

export default StudentDashboard;