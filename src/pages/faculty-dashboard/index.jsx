import React, { useState, useEffect } from 'react';
import MainNavigation from '../../components/ui/MainNavigation';
import AuthenticationGuard from '../../components/ui/AuthenticationGuard';
import ReviewStatisticsCard from './components/ReviewStatisticsCard';
import FilterControls from './components/FilterControls';
import MaterialReviewCard from './components/MaterialReviewCard';
import BatchActionsBar from './components/BatchActionsBar';
import RecentReviewsSection from './components/RecentReviewsSection';
import ReviewModal from './components/ReviewModal';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const FacultyDashboard = () => {
  const { isAuthenticated, userData } = useAuth();
  const userRole = userData?.role;
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [reviewModalMaterial, setReviewModalMaterial] = useState(null);
  
  const [pendingMaterials, setPendingMaterials] = useState([]);
  const [recentReviews, setRecentReviews] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0 });
  const [isLoading, setIsLoading] = useState(true);

  const [filters, setFilters] = useState({
    subject: 'all',
    fileType: 'all',
    priority: 'all',
    sortBy: 'date-desc',
    searchQuery: ''
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch stats
      const { data: allResources, error: statsError } = await supabase
        .from('resources')
        .select('status, created_at');
        
      if (!statsError && allResources) {
        const pendingCount = allResources.filter(r => r.status === 'pending').length;
        const approvedCount = allResources.filter(r => r.status === 'approved').length;
        const rejectedCount = allResources.filter(r => r.status === 'rejected').length;
        setStats({ pending: pendingCount, approved: approvedCount, rejected: rejectedCount });
      }

      // Fetch pending
      const { data: pendingData, error: pendingError } = await supabase
        .from('resources')
        .select('*, profiles:uploader_id(name)')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!pendingError && pendingData) {
        setPendingMaterials(pendingData.map(r => ({
          id: r.id,
          title: r.title,
          subject: r.subject,
          studentName: r.profiles?.name || 'Unknown Student',
          uploadDate: r.created_at,
          fileType: r.file_type?.toUpperCase(),
          fileSize: 'N/A',
          downloads: 0,
          priority: 'medium', // Default
          description: r.description,
          previewUrl: r.file_url,
          thumbnailAlt: r.title
        })));
      }

      // Fetch recent reviews
      const { data: recentData, error: recentError } = await supabase
        .from('resources')
        .select('*, profiles:uploader_id(name)')
        .in('status', ['approved', 'rejected'])
        .order('created_at', { ascending: false }) // Using created_at since updated_at may not exist
        .limit(10);

      if (!recentError && recentData) {
        setRecentReviews(recentData.map(r => ({
          id: r.id,
          title: r.title,
          subject: r.subject,
          studentName: r.profiles?.name || 'Unknown Student',
          fileType: r.file_type?.toUpperCase(),
          status: r.status,
          reviewedAt: r.created_at,
          comment: r.status === 'approved' ? 'Approved' : 'Rejected',
          notificationSent: true
        })));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const statistics = [
  {
    id: 1,
    type: 'pending',
    value: stats.pending.toString(),
    label: 'Pending Reviews',
    subtitle: 'Awaiting your review',
    trend: null
  },
  {
    id: 2,
    type: 'target',
    value: '8', // Target is arbitrary for now
    label: 'Daily Target',
    subtitle: 'Completed today',
    trend: null
  },
  {
    id: 3,
    type: 'approved',
    value: stats.approved.toString(),
    label: 'Total Approved',
    subtitle: 'Platform wide',
    trend: null
  },
  {
    id: 4,
    type: 'rejected',
    value: stats.rejected.toString(),
    label: 'Total Rejected',
    subtitle: 'Platform wide',
    trend: null
  }];

  const updateResourceStatus = async (id, status, isBatch = false) => {
    try {
      const { error } = await supabase
        .from('resources')
        .update({ status: status })
        .eq('id', id);
        
      if (error) throw error;
      
      if (!isBatch) {
        await fetchData();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update resource status.');
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetFilters = () => {
    setFilters({ subject: 'all', fileType: 'all', priority: 'all', sortBy: 'date-desc', searchQuery: '' });
  };

  const handleSelectMaterial = (id, isSelected) => {
    setSelectedMaterials((prev) => isSelected ? [...prev, id] : prev?.filter((materialId) => materialId !== id));
  };

  const handleClearSelection = () => {
    setSelectedMaterials([]);
  };

  const handleReview = (material) => {
    setReviewModalMaterial(material);
  };

  const handleQuickApprove = async (material) => {
    await updateResourceStatus(material.id, 'approved');
  };

  const handleQuickReject = async (material) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason !== null) {
      await updateResourceStatus(material.id, 'rejected');
    }
  };

  const handleBatchApprove = async () => {
    for (const id of selectedMaterials) {
      await updateResourceStatus(id, 'approved', true);
    }
    await fetchData();
    setSelectedMaterials([]);
  };

  const handleBatchReject = async () => {
    const reason = prompt('Please provide a reason for batch rejection:');
    if (reason !== null) {
      for (const id of selectedMaterials) {
        await updateResourceStatus(id, 'rejected', true);
      }
      await fetchData();
      setSelectedMaterials([]);
    }
  };

  const handleApproveFromModal = async (id, comment) => {
    await updateResourceStatus(id, 'approved');
    setReviewModalMaterial(null);
  };

  const handleRejectFromModal = async (id, comment) => {
    await updateResourceStatus(id, 'rejected');
    setReviewModalMaterial(null);
  };

  const handleViewReviewDetails = (review) => {
    console.log('View review details:', review);
  };

  const filteredMaterials = pendingMaterials?.filter((material) => {
    const matchesSubject = filters?.subject === 'all' || material?.subject?.toLowerCase()?.replace(/\s+/g, '-') === filters?.subject;
    const matchesFileType = filters?.fileType === 'all' || material?.fileType?.toLowerCase() === filters?.fileType;
    const matchesPriority = filters?.priority === 'all' || material?.priority === filters?.priority;
    const matchesSearch = filters?.searchQuery === '' || 
      material?.title?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase()) ||
      material?.studentName?.toLowerCase()?.includes(filters?.searchQuery?.toLowerCase());

    return matchesSubject && matchesFileType && matchesPriority && matchesSearch;
  });

  return (
    <AuthenticationGuard requiredRoles={['faculty', 'admin']}>
      <div className="min-h-screen bg-background">
        <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />

        <main className="pt-20 md:pt-24 pb-12 md:pb-16 px-4 md:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Faculty Dashboard
                </h1>
                <p className="text-base md:text-lg text-muted-foreground">
                  Review and manage academic resource submissions
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Button variant="outline" iconName="Settings" iconPosition="left" onClick={() => alert('Subject management coming soon')}>
                  Manage Subjects
                </Button>
                <Button variant="default" iconName="BarChart3" iconPosition="left" onClick={() => alert('Analytics coming soon')}>
                  View Analytics
                </Button>
              </div>
            </div>

            <ReviewStatisticsCard statistics={statistics} />

            <FilterControls
              filters={filters}
              onFilterChange={handleFilterChange}
              onReset={handleResetFilters}
              resultCount={filteredMaterials?.length} />

            <div>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  Pending Review Queue
                </h2>
                {selectedMaterials?.length > 0 &&
                <span className="text-sm md:text-base text-muted-foreground caption">
                    {selectedMaterials?.length} selected
                  </span>
                }
              </div>

              {isLoading ? (
                <div className="text-center p-8 text-muted-foreground">Loading pending reviews...</div>
              ) : filteredMaterials?.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <Icon name="Inbox" size={32} color="var(--color-muted-foreground)" />
                  </div>
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    No materials found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground">
                    Try adjusting your filters or check back later for new submissions
                  </p>
                </div>
              ) : (
                <div className="space-y-4 md:space-y-6">
                  {filteredMaterials?.map((material) =>
                    <MaterialReviewCard
                      key={material?.id}
                      material={material}
                      onReview={handleReview}
                      onQuickApprove={handleQuickApprove}
                      onQuickReject={handleQuickReject}
                      onSelect={handleSelectMaterial}
                      isSelected={selectedMaterials?.includes(material?.id)} />
                  )}
                </div>
              )}
            </div>

            <RecentReviewsSection
              reviews={recentReviews}
              onViewDetails={handleViewReviewDetails} />

          </div>
        </main>

        <BatchActionsBar
          selectedCount={selectedMaterials?.length}
          onBatchApprove={handleBatchApprove}
          onBatchReject={handleBatchReject}
          onClearSelection={handleClearSelection} />

        {reviewModalMaterial &&
        <ReviewModal
          material={reviewModalMaterial}
          onClose={() => setReviewModalMaterial(null)}
          onApprove={handleApproveFromModal}
          onReject={handleRejectFromModal} />
        }
      </div>
    </AuthenticationGuard>);
};

export default FacultyDashboard;