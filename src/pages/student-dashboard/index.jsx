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

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedUpload, setSelectedUpload] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');

    if (token && role === 'student') {
      setIsAuthenticated(true);
      setUserRole(role);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const studentStats = [
  {
    icon: 'Upload',
    label: 'Resources Shared',
    value: '12',
    trend: 'up',
    trendValue: '+3',
    iconBgColor: 'bg-blue-100 dark:bg-blue-900'
  },
  {
    icon: 'Download',
    label: 'Downloads Accessed',
    value: '48',
    trend: 'up',
    trendValue: '+12',
    iconBgColor: 'bg-purple-100 dark:bg-purple-900'
  },
  {
    icon: 'CheckCircle',
    label: 'Approved Resources',
    value: '9',
    trend: 'up',
    trendValue: '+2',
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


  const recentUploads = [
  {
    id: 1,
    title: 'Data Structures and Algorithms - Complete Notes',
    subject: 'Computer Science',
    fileType: 'PDF',
    uploadDate: '2025-12-20T10:30:00',
    status: 'approved',
    downloads: 24,
    feedback: null
  },
  {
    id: 2,
    title: 'Organic Chemistry Reaction Mechanisms',
    subject: 'Chemistry',
    fileType: 'PPT',
    uploadDate: '2025-12-22T14:15:00',
    status: 'pending',
    downloads: 0,
    feedback: null
  },
  {
    id: 3,
    title: 'Calculus II - Integration Techniques',
    subject: 'Mathematics',
    fileType: 'PDF',
    uploadDate: '2025-12-18T09:00:00',
    status: 'rejected',
    downloads: 0,
    feedback: 'The content needs more detailed explanations for complex integration methods. Please include step-by-step solutions for at least 5 examples per technique.'
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
  },
  {
    id: 'biology',
    name: 'Biology',
    description: 'Cell biology, genetics, ecology, and human anatomy resources',
    icon: 'Microscope',
    iconBg: 'bg-red-100 dark:bg-red-900',
    resourceCount: 112,
    lastUpdated: '6 hours ago'
  },
  {
    id: 'engineering',
    name: 'Engineering',
    description: 'Mechanical, electrical, civil engineering principles and applications',
    icon: 'Cog',
    iconBg: 'bg-indigo-100 dark:bg-indigo-900',
    resourceCount: 143,
    lastUpdated: '4 hours ago'
  }];


  const recommendedResources = [
  {
    id: 1,
    title: 'Advanced Database Management Systems - Complete Guide',
    subject: 'Computer Science',
    fileType: 'PDF',
    uploaderName: 'Dr. Sarah Mitchell',
    uploaderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1b43e8b7f-1763295504724.png",
    uploaderAvatarAlt: 'Professional headshot of Caucasian woman with shoulder-length brown hair wearing navy blazer and white blouse',
    uploadDate: '2025-12-24T11:20:00',
    downloads: 156,
    rating: 4.8
  },
  {
    id: 2,
    title: 'Linear Algebra Applications in Machine Learning',
    subject: 'Mathematics',
    fileType: 'PPT',
    uploaderName: 'Prof. James Chen',
    uploaderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1bb8988be-1763295050652.png",
    uploaderAvatarAlt: 'Professional headshot of Asian man with short black hair wearing gray suit and blue tie',
    uploadDate: '2025-12-23T16:45:00',
    downloads: 203,
    rating: 4.9
  },
  {
    id: 3,
    title: 'Quantum Mechanics - Wave Functions and Operators',
    subject: 'Physics',
    fileType: 'PDF',
    uploaderName: 'Dr. Emily Rodriguez',
    uploaderAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_1631c1677-1763295642190.png",
    uploaderAvatarAlt: 'Professional headshot of Hispanic woman with long dark hair wearing burgundy blouse',
    uploadDate: '2025-12-25T09:30:00',
    downloads: 89,
    rating: 4.7
  }];


  const activityFeed = [
  {
    id: 1,
    type: 'approval',
    message: 'Your resource "Data Structures and Algorithms - Complete Notes" has been approved by Dr. Sarah Mitchell',
    timestamp: new Date(Date.now() - 7200000),
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_17784c577-1763297418164.png",
    userAvatarAlt: 'Professional headshot of Caucasian woman with shoulder-length brown hair wearing navy blazer'
  },
  {
    id: 2,
    type: 'collaboration',
    message: 'New study group formed for Advanced Database Management Systems - 12 students joined',
    timestamp: new Date(Date.now() - 14400000),
    userAvatar: null,
    userAvatarAlt: null
  },
  {
    id: 3,
    type: 'upload',
    message: 'Prof. James Chen uploaded new resource: "Linear Algebra Applications in Machine Learning"',
    timestamp: new Date(Date.now() - 21600000),
    userAvatar: "https://img.rocket.new/generatedImages/rocket_gen_img_13a48293d-1763296098326.png",
    userAvatarAlt: 'Professional headshot of Asian man with short black hair wearing gray suit'
  },
  {
    id: 4,
    type: 'download',
    message: 'Your resource has been downloaded 5 times in the last hour',
    timestamp: new Date(Date.now() - 28800000),
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

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
      <main className="pt-16 md:pt-20 pb-8 md:pb-12 lg:pb-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-6 md:mb-8 lg:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 md:gap-6 mb-6 md:mb-8">
              <div>
                <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-2">
                  Welcome Back, Student!
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
                    Recent Uploads
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    iconName="ArrowRight"
                    iconPosition="right">

                    View All
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 gap-4 md:gap-5">
                  {recentUploads?.map((upload) =>
                  <RecentUploadCard
                    key={upload?.id}
                    upload={upload}
                    onViewFeedback={handleViewFeedback} />

                  )}
                </div>
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
                
                <div className="space-y-4 md:space-y-5">
                  {recommendedResources?.map((resource) =>
                  <RecommendedResourceCard key={resource?.id} resource={resource} />
                  )}
                </div>
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
    </div>);

};

export default StudentDashboard;