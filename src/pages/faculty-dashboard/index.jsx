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

const FacultyDashboard = () => {
  const [userRole] = useState('faculty');
  const [isAuthenticated] = useState(true);
  const [selectedMaterials, setSelectedMaterials] = useState([]);
  const [reviewModalMaterial, setReviewModalMaterial] = useState(null);
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

  const statistics = [
  {
    id: 1,
    type: 'pending',
    value: '24',
    label: 'Pending Reviews',
    subtitle: 'Awaiting your review',
    trend: null
  },
  {
    id: 2,
    type: 'target',
    value: '8',
    label: 'Daily Target',
    subtitle: '3 completed today',
    trend: null
  },
  {
    id: 3,
    type: 'approved',
    value: '156',
    label: 'Approved This Month',
    subtitle: '89% approval rate',
    trend: 12
  },
  {
    id: 4,
    type: 'rejected',
    value: '18',
    label: 'Rejected This Month',
    subtitle: '11% rejection rate',
    trend: -5
  }];


  const pendingMaterials = [
  {
    id: 1,
    title: 'Advanced Calculus Problem Sets with Detailed Solutions',
    subject: 'Mathematics',
    studentName: 'Sarah Johnson',
    uploadDate: '2025-12-24T10:30:00',
    fileType: 'PDF',
    fileSize: '2.4 MB',
    downloads: 0,
    priority: 'high',
    thumbnail: "https://images.unsplash.com/photo-1658551345623-5bcc9eae7c1e",
    thumbnailAlt: 'Close-up view of mathematical equations and calculus formulas written on white paper with blue pen',
    description: 'Comprehensive collection of advanced calculus problems covering limits, derivatives, integrals, and series with step-by-step solutions for each problem.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 2,
    title: 'Quantum Mechanics Lecture Notes - Semester 1',
    subject: 'Physics',
    studentName: 'Michael Chen',
    uploadDate: '2025-12-23T14:15:00',
    fileType: 'PDF',
    fileSize: '5.8 MB',
    downloads: 0,
    priority: 'high',
    thumbnail: "https://img.rocket.new/generatedImages/rocket_gen_img_1033cff0b-1765310691002.png",
    thumbnailAlt: 'Quantum physics equations and wave functions displayed on dark chalkboard with colorful chalk illustrations',
    description: 'Complete lecture notes from Quantum Mechanics course covering wave-particle duality, Schrödinger equation, and quantum states.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 3,
    title: 'Organic Chemistry Reaction Mechanisms Guide',
    subject: 'Chemistry',
    studentName: 'Emily Rodriguez',
    uploadDate: '2025-12-23T09:45:00',
    fileType: 'PPT',
    fileSize: '3.2 MB',
    downloads: 0,
    priority: 'medium',
    thumbnail: "https://images.unsplash.com/photo-1677381742617-5dd0d0cbecab",
    thumbnailAlt: 'Colorful molecular structure models and chemical formulas on laboratory desk with test tubes in background',
    description: 'Visual presentation of major organic chemistry reaction mechanisms with detailed arrow-pushing diagrams and examples.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 4,
    title: 'Data Structures and Algorithms Implementation in Python',
    subject: 'Computer Science',
    studentName: 'David Kim',
    uploadDate: '2025-12-22T16:20:00',
    fileType: 'PDF',
    fileSize: '4.1 MB',
    downloads: 0,
    priority: 'medium',
    thumbnail: "https://images.unsplash.com/photo-1479838376502-4b3c533c4bb5",
    thumbnailAlt: 'Python programming code displayed on computer screen showing data structure implementation with syntax highlighting',
    description: 'Practical guide to implementing common data structures and algorithms in Python with code examples and complexity analysis.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 5,
    title: 'Cell Biology Lab Manual - Microscopy Techniques',
    subject: 'Biology',
    studentName: 'Jessica Martinez',
    uploadDate: '2025-12-22T11:30:00',
    fileType: 'DOC',
    fileSize: '1.9 MB',
    downloads: 0,
    priority: 'low',
    thumbnail: "https://images.unsplash.com/photo-1617178373958-6194eede5e98",
    thumbnailAlt: 'Microscopic view of colorful stained cells showing detailed cellular structures and organelles under high magnification',
    description: 'Laboratory manual covering various microscopy techniques for cell biology studies including sample preparation and staining methods.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  },
  {
    id: 6,
    title: 'Shakespeare Analysis - Hamlet Character Study',
    subject: 'English Literature',
    studentName: 'Robert Taylor',
    uploadDate: '2025-12-21T15:45:00',
    fileType: 'PDF',
    fileSize: '2.7 MB',
    downloads: 0,
    priority: 'low',
    thumbnail: "https://images.unsplash.com/photo-1706726080890-e004621ba852",
    thumbnailAlt: 'Open vintage book with Shakespeare text on wooden desk with quill pen and candlelight creating dramatic atmosphere',
    description: 'In-depth character analysis of major characters in Hamlet with textual evidence and critical interpretations.',
    previewUrl: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'
  }];


  const recentReviews = [
  {
    id: 1,
    title: 'Linear Algebra Study Guide',
    subject: 'Mathematics',
    studentName: 'Alex Thompson',
    fileType: 'PDF',
    status: 'approved',
    reviewedAt: '2025-12-26T10:15:00',
    comment: 'Excellent resource with clear explanations and examples.',
    notificationSent: true
  },
  {
    id: 2,
    title: 'Thermodynamics Problem Solutions',
    subject: 'Physics',
    studentName: 'Maria Garcia',
    fileType: 'PDF',
    status: 'approved',
    reviewedAt: '2025-12-26T09:30:00',
    comment: 'Well-organized solutions with proper methodology.',
    notificationSent: true
  },
  {
    id: 3,
    title: 'Incomplete Chemistry Notes',
    subject: 'Chemistry',
    studentName: 'James Wilson',
    fileType: 'DOC',
    status: 'rejected',
    reviewedAt: '2025-12-26T08:45:00',
    comment: 'Content is incomplete and missing key topics. Please revise and resubmit with complete information.',
    notificationSent: false
  }];


  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      subject: 'all',
      fileType: 'all',
      priority: 'all',
      sortBy: 'date-desc',
      searchQuery: ''
    });
  };

  const handleSelectMaterial = (id, isSelected) => {
    setSelectedMaterials((prev) =>
    isSelected ? [...prev, id] : prev?.filter((materialId) => materialId !== id)
    );
  };

  const handleClearSelection = () => {
    setSelectedMaterials([]);
  };

  const handleReview = (material) => {
    setReviewModalMaterial(material);
  };

  const handleQuickApprove = (material) => {
    console.log('Quick approve:', material?.id);
    alert(`"${material?.title}" has been approved successfully!`);
  };

  const handleQuickReject = (material) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason) {
      console.log('Quick reject:', material?.id, reason);
      alert(`"${material?.title}" has been rejected.`);
    }
  };

  const handleBatchApprove = () => {
    console.log('Batch approve:', selectedMaterials);
    alert(`${selectedMaterials?.length} materials have been approved successfully!`);
    setSelectedMaterials([]);
  };

  const handleBatchReject = () => {
    const reason = prompt('Please provide a reason for batch rejection:');
    if (reason) {
      console.log('Batch reject:', selectedMaterials, reason);
      alert(`${selectedMaterials?.length} materials have been rejected.`);
      setSelectedMaterials([]);
    }
  };

  const handleApproveFromModal = (id, comment) => {
    console.log('Approve from modal:', id, comment);
    alert('Material approved successfully!');
    setReviewModalMaterial(null);
  };

  const handleRejectFromModal = (id, comment) => {
    console.log('Reject from modal:', id, comment);
    alert('Material rejected successfully!');
    setReviewModalMaterial(null);
  };

  const handleViewReviewDetails = (review) => {
    console.log('View review details:', review);
  };

  const filteredMaterials = pendingMaterials?.filter((material) => {
    const matchesSubject =
    filters?.subject === 'all' || material?.subject?.toLowerCase()?.replace(/\s+/g, '-') === filters?.subject;
    const matchesFileType =
    filters?.fileType === 'all' ||
    material?.fileType?.toLowerCase() === filters?.fileType;
    const matchesPriority =
    filters?.priority === 'all' || material?.priority === filters?.priority;
    const matchesSearch =
    filters?.searchQuery === '' ||
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
                <Button
                  variant="outline"
                  iconName="Settings"
                  iconPosition="left"
                  onClick={() => alert('Subject management coming soon')}>

                  Manage Subjects
                </Button>
                <Button
                  variant="default"
                  iconName="BarChart3"
                  iconPosition="left"
                  onClick={() => alert('Analytics coming soon')}>

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

              {filteredMaterials?.length === 0 ?
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
                </div> :

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
              }
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