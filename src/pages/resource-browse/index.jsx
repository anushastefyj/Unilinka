import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import ResourceCard from './components/ResourceCard';
import FilterPanel from './components/FilterPanel';
import SubjectSidebar from './components/SubjectSidebar';
import ResourceDetailModal from './components/ResourceDetailModal';
import FeaturedSection from './components/FeaturedSection';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ACADEMIC_YEARS, SUBJECTS_BY_YEAR, getAllSubjects } from '../../config/curriculum';

const ResourceBrowse = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const userRole = userData?.role;
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    academicYear: 'All Years',
    subject: 'all',
    fileTypes: [],
    academicLevels: [],
    sortBy: 'recent',
    verifiedOnly: false,
    featuredOnly: false
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    setDownloadHistory(history);
  }, []);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select(`
            *,
            profiles:uploader_id(name)
          `)
          .eq('status', 'approved');

        if (error) throw error;

        const formatted = data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || "No description provided.",
          academicYear: r.academic_year || 'Unknown',
          subject: r.subject,
          fileType: r.file_type?.toUpperCase(),
          fileSize: "N/A", 
          academicLevel: "Unknown",
          uploadDate: r.created_at,
          uploadedBy: r.profiles?.name || "Unknown",
          facultyVerified: true, 
          isFeatured: false, 
          downloadCount: r.download_count || 0,
          tags: [],
          fileUrl: r.file_url
        }));

        setResources(formatted);
      } catch (error) {
        console.error("Error fetching resources:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchResources();
  }, []);

  // Filter resources based on all active filters
  const getFilteredResources = () => {
    let filtered = [...resources];

    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(resource =>
        resource?.title?.toLowerCase()?.includes(query) ||
        resource?.description?.toLowerCase()?.includes(query) ||
        resource?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
    }

    if (filters.academicYear && filters.academicYear !== 'All Years') {
      filtered = filtered.filter(resource => resource.academicYear === filters.academicYear);
    }

    if (filters?.subject && filters?.subject !== 'all') {
      filtered = filtered?.filter(resource => resource?.subject === filters?.subject);
    }

    if (filters?.fileTypes && filters?.fileTypes?.length > 0) {
      filtered = filtered?.filter(resource => filters?.fileTypes?.includes(resource?.fileType));
    }

    if (filters?.academicLevels && filters?.academicLevels?.length > 0) {
      filtered = filtered?.filter(resource => filters?.academicLevels?.includes(resource?.academicLevel));
    }

    if (filters?.verifiedOnly) {
      filtered = filtered?.filter(resource => resource?.facultyVerified);
    }

    if (filters?.featuredOnly) {
      filtered = filtered?.filter(resource => resource?.isFeatured);
    }

    switch (filters?.sortBy) {
      case 'popular':
        filtered?.sort((a, b) => b?.downloadCount - a?.downloadCount);
        break;
      case 'title':
        filtered?.sort((a, b) => a?.title?.localeCompare(b?.title));
        break;
      case 'recent':
      default:
        filtered?.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();
  const featuredResources = resources?.filter(r => r?.isFeatured)?.slice(0, 3);

  const handleDownload = async (resource) => {
    const newHistory = [
      {
        id: resource?.id,
        title: resource?.title,
        downloadDate: new Date()?.toISOString()
      },
      ...downloadHistory?.filter(h => h?.id !== resource?.id)
    ]?.slice(0, 10);

    setDownloadHistory(newHistory);
    localStorage.setItem('downloadHistory', JSON.stringify(newHistory));

    // Increment download count in DB
    try {
      await supabase.rpc('increment_download_count', { resource_id: resource.id });
    } catch (error) {
      console.error('Failed to increment download count', error);
    }

    const link = document.createElement('a');
    link.href = resource.fileUrl || '#';
    link.download = `${resource?.title}.${resource?.fileType?.toLowerCase()}`;
    link.target = '_blank';
    document.body?.appendChild(link);
    link?.click();
    document.body?.removeChild(link);
  };

  const handleViewDetails = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleClearFilters = () => {
    setFilters({
      academicYear: 'All Years',
      subject: 'all',
      fileTypes: [],
      academicLevels: [],
      sortBy: 'recent',
      verifiedOnly: false,
      featuredOnly: false
    });
    setSearchQuery('');
  };

  const handleYearChange = (yearValue) => {
    // When year changes, reset the selected subject since subjects are year-specific
    setFilters({ ...filters, academicYear: yearValue, subject: 'all' });
  };

  const handleSubjectChange = (subjectName) => {
    setFilters({ ...filters, subject: subjectName === 'All Subjects' ? 'all' : subjectName });
  };

  // Generate subject list based on selected Academic Year
  const currentSubjects = filters.academicYear === 'All Years' 
    ? getAllSubjects()
    : SUBJECTS_BY_YEAR[filters.academicYear] || [];
  
  // Format subjects for sidebar
  const sidebarSubjects = [
    { id: 'all', name: 'All Subjects', icon: 'BookOpen', count: filteredResources.length, hasNew: false },
    ...currentSubjects.map((subjectName, idx) => ({
      id: idx.toString(),
      name: subjectName,
      icon: 'FileText',
      count: resources.filter(r => r.subject === subjectName && (filters.academicYear === 'All Years' || r.academicYear === filters.academicYear)).length,
      hasNew: false
    }))
  ];

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
      <div className="pt-16 md:pt-20">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Browse Academic Resources
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl mb-8">
              Discover verified study materials spanning across your AI & Data Science engineering curriculum.
            </p>
            
            {/* Top Cards for Academic Years */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {ACADEMIC_YEARS.map(year => {
                const isSelected = filters.academicYear === year.value;
                const count = year.value === 'All Years' 
                  ? resources.length 
                  : resources.filter(r => r.academicYear === year.value).length;
                  
                return (
                  <button
                    key={year.id}
                    onClick={() => handleYearChange(year.value)}
                    className={`p-4 rounded-2xl border text-left transition-all hover:-translate-y-1 ${
                      isSelected 
                        ? 'bg-primary border-primary text-white shadow-md' 
                        : 'bg-white border-border hover:border-primary/50 text-foreground'
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-1">{year.label}</h3>
                    <p className={`text-sm font-medium ${isSelected ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                      {count} {count === 1 ? 'Resource' : 'Resources'}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <SubjectSidebar
              subjects={sidebarSubjects}
              activeSubject={filters?.subject === 'all' ? 'All Subjects' : filters?.subject}
              onSubjectChange={handleSubjectChange}
            />

            <div className="flex-1 min-w-0">
              <div className="bg-card border border-border rounded-xl p-4 md:p-6 mb-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <Input
                      type="search"
                      placeholder="Search by title, description, or tags..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e?.target?.value)}
                    />
                  </div>
                  <Button
                    variant="outline"
                    iconName="SlidersHorizontal"
                    iconPosition="left"
                    onClick={() => setIsFilterOpen(true)}
                    className="lg:hidden"
                  >
                    Filters
                  </Button>
                </div>

                {(searchQuery || filters?.subject !== 'all' || filters?.academicYear !== 'All Years' || filters?.fileTypes?.length > 0 || 
                  filters?.academicLevels?.length > 0 || filters?.verifiedOnly || filters?.featuredOnly) && (
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    <div className="flex flex-wrap gap-2">
                      {searchQuery && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                          Search: {searchQuery}
                          <button onClick={() => setSearchQuery('')}>
                            <Icon name="X" size={14} />
                          </button>
                        </span>
                      )}
                      {filters?.academicYear !== 'All Years' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                          {filters?.academicYear}
                          <button onClick={() => handleYearChange('All Years')}>
                            <Icon name="X" size={14} />
                          </button>
                        </span>
                      )}
                      {filters?.subject !== 'all' && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-xs">
                          {filters?.subject}
                          <button onClick={() => setFilters({ ...filters, subject: 'all' })}>
                            <Icon name="X" size={14} />
                          </button>
                        </span>
                      )}
                      <Button
                        variant="ghost"
                        size="xs"
                        iconName="RotateCcw"
                        onClick={handleClearFilters}
                      >
                        Clear all
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              {featuredResources?.length > 0 && !filters?.featuredOnly && (
                <FeaturedSection
                  resources={featuredResources}
                  onViewDetails={handleViewDetails}
                  onDownload={handleDownload}
                />
              )}

              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl md:text-2xl font-semibold text-foreground">
                  {filters.academicYear === 'All Years' ? 'All Resources' : `${filters.academicYear} Resources`}
                  <span className="ml-2 text-base text-muted-foreground">
                    ({filteredResources?.length})
                  </span>
                </h2>
              </div>

              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="animate-pulse bg-muted rounded-xl h-[300px]"></div>
                  ))}
                </div>
              ) : filteredResources?.length === 0 ? (
                <div className="bg-card border border-border rounded-xl p-8 md:p-12 text-center">
                  <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg md:text-xl font-semibold text-foreground mb-2">
                    No resources found
                  </h3>
                  <p className="text-sm md:text-base text-muted-foreground mb-4">
                    Try adjusting your filters or search query
                  </p>
                  <Button
                    variant="outline"
                    iconName="RotateCcw"
                    iconPosition="left"
                    onClick={handleClearFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                  {filteredResources?.map((resource) => (
                    <ResourceCard
                      key={resource?.id}
                      resource={resource}
                      onDownload={handleDownload}
                      onViewDetails={handleViewDetails}
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="hidden lg:block w-80">
              <FilterPanel
                filters={filters}
                onFilterChange={setFilters}
                onClearFilters={handleClearFilters}
                resultCount={filteredResources?.length}
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <FilterPanel
        filters={filters}
        onFilterChange={setFilters}
        onClearFilters={handleClearFilters}
        resultCount={filteredResources?.length}
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
      />
      <ResourceDetailModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default ResourceBrowse;