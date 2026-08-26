import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import ResourceCard from './components/ResourceCard';
import FilterPanel from './components/FilterPanel';
import ResourceDetailModal from './components/ResourceDetailModal';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { ACADEMIC_YEARS, SUBJECTS_BY_YEAR, getAllSubjects } from '../../config/curriculum';

const ResourceBrowse = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useAuth();
  const userRole = userData?.role;
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const location = useLocation();
  
  // Initialize from location state if we navigated from Dashboard Year Cards
  const initialYear = location.state?.selectedYear || 'All Years';
  const initialSubject = location.state?.selectedSubject || 'all';
  
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [filters, setFilters] = useState({
    academicYear: initialYear,
    subject: initialSubject,
    fileTypes: [],
    sortBy: 'recent',
    verifiedOnly: false
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
          description: r.description || "",
          academicYear: r.academic_year || 'Unknown',
          subject: r.subject,
          fileType: r.file_type?.toUpperCase(),
          uploadDate: r.created_at,
          uploadedBy: r.profiles?.name || "Unknown",
          facultyVerified: false, // Hidden for now as requested unless verified data exists
          downloadCount: r.download_count || 0,
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
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        resource.title?.toLowerCase().includes(query) ||
        resource.description?.toLowerCase().includes(query) ||
        resource.subject?.toLowerCase().includes(query)
      );
    }

    if (filters.academicYear && filters.academicYear !== 'All Years') {
      filtered = filtered.filter(resource => resource.academicYear === filters.academicYear);
    }

    if (filters.subject && filters.subject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === filters.subject);
    }

    if (filters.fileTypes && filters.fileTypes.length > 0) {
      filtered = filtered.filter(resource => filters.fileTypes.includes(resource.fileType));
    }

    if (filters.verifiedOnly) {
      filtered = filtered.filter(resource => resource.facultyVerified);
    }

    switch (filters.sortBy) {
      case 'popular':
        filtered.sort((a, b) => b.downloadCount - a.downloadCount);
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'recent':
      default:
        filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
        break;
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();

  const handleDownload = async (resource) => {
    const newHistory = [
      {
        id: resource.id,
        title: resource.title,
        downloadDate: new Date().toISOString()
      },
      ...downloadHistory.filter(h => h.id !== resource.id)
    ].slice(0, 10);

    setDownloadHistory(newHistory);
    localStorage.setItem('downloadHistory', JSON.stringify(newHistory));

    // Increment download count in DB
    try {
      await supabase.rpc('increment_download_count', { resource_id: resource.id });
      // Update local state to show new download count immediately
      setResources(prev => prev.map(r => r.id === resource.id ? { ...r, downloadCount: r.downloadCount + 1 } : r));
    } catch (error) {
      console.error('Failed to increment download count', error);
    }

    const link = document.createElement('a');
    link.href = resource.fileUrl || '#';
    link.download = `${resource.title}.${resource.fileType?.toLowerCase()}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
      sortBy: 'recent',
      verifiedOnly: false
    });
    setSearchQuery('');
  };

  // Generate subject list based on selected Academic Year
  const currentSubjects = filters.academicYear === 'All Years' 
    ? getAllSubjects()
    : SUBJECTS_BY_YEAR[filters.academicYear] || [];
  
  // Format subjects for sidebar
  const sidebarSubjects = [
    { id: 'all', name: 'All Subjects', count: resources.length },
    ...currentSubjects.map((subjectName, idx) => ({
      id: idx.toString(),
      name: subjectName,
      count: resources.filter(r => r.subject === subjectName && (filters.academicYear === 'All Years' || r.academicYear === filters.academicYear)).length,
    }))
  ];

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-body">
      <Helmet>
        <title>Browse Resources - Unilinka</title>
      </Helmet>
      
      <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
      
      <div className="pt-16 lg:pt-20 flex-1 flex flex-col">
        {/* Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">
              Explore Academic Resources
            </h1>
            <p className="text-gray-600 max-w-2xl mb-8 text-sm sm:text-base">
              Find notes, presentations, and study materials organized by your curriculum.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative flex-1 w-full">
                <input
                  type="search"
                  placeholder="Search notes, subjects, or file names..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-12 pr-4 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#135ea2]/20 focus:border-[#135ea2] transition-colors"
                />
                <Icon name="Search" size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <button
                onClick={() => setIsFilterOpen(true)}
                className="lg:hidden w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Icon name="SlidersHorizontal" size={18} />
                Filters
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex items-start gap-8">
          
          {/* Unified Sidebar Filter Panel */}
          <FilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onClearFilters={handleClearFilters}
            resultCount={filteredResources.length}
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            subjects={sidebarSubjects}
          />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            
            {/* Active Filters Bar */}
            {(searchQuery || filters.subject !== 'all' || filters.academicYear !== 'All Years' || filters.fileTypes.length > 0 || filters.verifiedOnly) && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-sm text-gray-500 font-medium mr-2">Active filters:</span>
                
                {searchQuery && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    "{searchQuery}"
                    <button onClick={() => setSearchQuery('')} className="hover:text-gray-900"><Icon name="X" size={12} /></button>
                  </span>
                )}
                {filters.academicYear !== 'All Years' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#135ea2]/10 border border-[#135ea2]/20 rounded-full text-xs font-bold text-[#135ea2]">
                    {filters.academicYear}
                    <button onClick={() => setFilters({ ...filters, academicYear: 'All Years' })} className="hover:text-[#0f4b82]"><Icon name="X" size={12} /></button>
                  </span>
                )}
                {filters.subject !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#135ea2]/10 border border-[#135ea2]/20 rounded-full text-xs font-bold text-[#135ea2]">
                    {filters.subject}
                    <button onClick={() => setFilters({ ...filters, subject: 'all' })} className="hover:text-[#0f4b82]"><Icon name="X" size={12} /></button>
                  </span>
                )}
                {filters.fileTypes.map(type => (
                  <span key={type} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    {type}
                    <button onClick={() => {
                      setFilters({ ...filters, fileTypes: filters.fileTypes.filter(t => t !== type) })
                    }} className="hover:text-gray-900"><Icon name="X" size={12} /></button>
                  </span>
                ))}
                
                <button
                  onClick={handleClearFilters}
                  className="text-sm font-medium text-gray-500 hover:text-gray-900 ml-auto"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {filters.academicYear === 'All Years' ? 'All Resources' : `${filters.academicYear} Resources`}
                <span className="ml-2 text-sm font-normal text-gray-500">
                  ({filteredResources.length})
                </span>
              </h2>
            </div>

            {/* Resource Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="animate-pulse bg-white border border-gray-100 rounded-2xl h-64 w-full"></div>
                ))}
              </div>
            ) : filteredResources.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-16 text-center">
                <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4 text-gray-400">
                  <Icon name="SearchX" size={32} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No resources match your filters
                </h3>
                <p className="text-gray-500 mb-6 max-w-sm mx-auto">
                  Try adjusting your search query, or clear your filters to see more results.
                </p>
                <button
                  onClick={handleClearFilters}
                  className="bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 px-6 py-2.5 rounded-xl text-sm font-medium transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredResources.map((resource) => (
                  <ResourceCard
                    key={resource.id}
                    resource={resource}
                    onDownload={handleDownload}
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      
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