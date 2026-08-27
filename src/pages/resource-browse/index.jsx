import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import Icon from '../../components/AppIcon';
import RecentResourceCard from '../student-dashboard/components/RecentResourceCard';
import FilterPanel from './components/FilterPanel';
import StudentLayout from '../../components/layout/StudentLayout';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';
import { SUBJECTS_BY_YEAR, getAllSubjects } from '../../config/curriculum';

const ResourceBrowse = () => {
  const { userData } = useAuth();
  const location = useLocation();
  
  const initialYear = location.state?.selectedYear || 'All Years';
  const initialSubject = location.state?.selectedSubject || 'all';
  
  const [resources, setResources] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState(location.state?.searchQuery || '');
  const [filters, setFilters] = useState({
    academicYear: initialYear,
    branch: 'All Branches',
    semester: 'All Semesters',
    subject: initialSubject,
    fileType: 'All Types',
    sortBy: 'recent'
  });
  
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchResources = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('resources')
          .select('*')
          .eq('status', 'approved');

        if (error) throw error;

        const formatted = data.map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || "",
          academicYear: r.academic_year || 'Unknown',
          subject: r.subject,
          branch: r.branch || 'CSE', // Mock fallback if not in DB
          semester: r.semester || 'Semester 1', // Mock fallback if not in DB
          fileType: r.file_type?.toUpperCase() || 'PDF',
          uploadDate: r.created_at,
          fileUrl: r.file_url,
          
          // MOCK: This simulates our new PDF Indexing feature where the backend extracted text!
          mockIndexedText: r.title.toLowerCase() + " " + (r.description || "").toLowerCase() + " mock pdf extracted text data structures binary trees algorithm complexity limits calculus integration"
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

  const getFilteredResources = () => {
    let filtered = [...resources];

    // Smart Search matching
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(resource =>
        // Match indexed text (Phase 1 PDF indexing)
        resource.mockIndexedText.includes(query)
      );
    }

    if (filters.academicYear && filters.academicYear !== 'All Years') {
      filtered = filtered.filter(resource => resource.academicYear === filters.academicYear);
    }

    if (filters.branch && filters.branch !== 'All Branches') {
      filtered = filtered.filter(resource => resource.branch === filters.branch);
    }

    if (filters.semester && filters.semester !== 'All Semesters') {
      filtered = filtered.filter(resource => resource.semester === filters.semester);
    }

    if (filters.subject && filters.subject !== 'all') {
      filtered = filtered.filter(resource => resource.subject === filters.subject);
    }

    if (filters.fileType && filters.fileType !== 'All Types') {
      const typeMap = {
        'PDF': ['PDF'],
        'Word': ['DOC', 'DOCX'],
        'PPT': ['PPT', 'PPTX']
      };
      const allowed = typeMap[filters.fileType] || [];
      filtered = filtered.filter(resource => allowed.includes(resource.fileType));
    }

    if (filters.sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));
    }

    return filtered;
  };

  const filteredResources = getFilteredResources();

  const handleClearFilters = () => {
    setFilters({
      academicYear: 'All Years',
      branch: 'All Branches',
      semester: 'All Semesters',
      subject: 'all',
      fileType: 'All Types',
      sortBy: 'recent'
    });
    setSearchQuery('');
  };

  const currentSubjects = filters.academicYear === 'All Years' 
    ? getAllSubjects()
    : SUBJECTS_BY_YEAR[filters.academicYear] || [];
  
  const sidebarSubjects = [
    { id: 'all', name: 'All Subjects', count: resources.length },
    ...currentSubjects.map((subjectName, idx) => ({
      id: idx.toString(),
      name: subjectName,
      count: resources.filter(r => r.subject === subjectName && (filters.academicYear === 'All Years' || r.academicYear === filters.academicYear)).length,
    }))
  ];

  const headerSearch = (
    <div className="w-full max-w-xl">
      <div className="relative">
        <Icon name="Search" size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input 
          type="text" 
          placeholder="Smart Search inside PDFs (e.g., 'binary search trees')"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[#1F4D3A]/30 transition-colors"
        />
      </div>
    </div>
  );

  return (
    <StudentLayout headerContent={headerSearch}>
      <Helmet>
        <title>Smart Search - Unilinka</title>
      </Helmet>
      
      <div className="flex flex-col lg:flex-row gap-8 animate-in fade-in duration-300">
        
        {/* Filters Sidebar */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <div className="bg-white border border-[#E7E2D6] rounded-2xl p-6 shadow-sm sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-[#1C1C1C]">Filters</h3>
              <button onClick={handleClearFilters} className="text-xs font-bold text-[#1F4D3A] hover:underline">
                Clear All
              </button>
            </div>
            
            {/* Very simple mock filter UI for consistency */}
            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2 block">Academic Year</label>
                <select 
                  value={filters.academicYear}
                  onChange={(e) => setFilters({...filters, academicYear: e.target.value})}
                  className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option>All Years</option>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2 block">Branch</label>
                <select 
                  value={filters.branch}
                  onChange={(e) => setFilters({...filters, branch: e.target.value})}
                  className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option>All Branches</option>
                  <option>CSE</option>
                  <option>ECE</option>
                  <option>ME</option>
                  <option>CE</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2 block">Semester</label>
                <select 
                  value={filters.semester}
                  onChange={(e) => setFilters({...filters, semester: e.target.value})}
                  className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option>All Semesters</option>
                  <option>Semester 1</option>
                  <option>Semester 2</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2 block">Subject</label>
                <select 
                  value={filters.subject}
                  onChange={(e) => setFilters({...filters, subject: e.target.value})}
                  className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  {sidebarSubjects.map(s => (
                    <option key={s.id} value={s.name === 'All Subjects' ? 'all' : s.name}>
                      {s.name} ({s.count})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2 block">File Type</label>
                <select 
                  value={filters.fileType}
                  onChange={(e) => setFilters({...filters, fileType: e.target.value})}
                  className="w-full bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl py-2 px-3 text-sm focus:outline-none"
                >
                  <option>All Types</option>
                  <option>PDF</option>
                  <option>Word</option>
                  <option>PPT</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Results Area */}
        <div className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#1C1C1C] font-serif">
              {searchQuery ? 'Smart Search Results' : 'Browse Resources'}
              <span className="ml-2 text-sm font-normal text-[#5C5C5C]">
                ({filteredResources.length})
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin text-[#1F4D3A]">
                <Icon name="Loader" size={32} />
              </div>
            </div>
          ) : filteredResources.length === 0 ? (
            <div className="text-center py-20 bg-white border border-[#E7E2D6] rounded-2xl shadow-sm">
              <Icon name="SearchX" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No matching resources</h3>
              <p className="text-[#5C5C5C]">Try adjusting your search terms or clearing your filters.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredResources.map(resource => (
                <div key={resource.id}>
                  <RecentResourceCard resource={resource} />
                  
                  {/* Smart Search Snippet UI (Mock) */}
                  {searchQuery && (
                    <div className="ml-16 mr-4 -mt-2 mb-4 bg-[#FAF7F0] border border-[#E7E2D6] border-t-0 rounded-b-xl p-4 shadow-inner text-sm text-[#5C5C5C]">
                      <div className="flex items-start gap-2">
                        <Icon name="Search" size={16} className="text-[#1F4D3A] mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-bold text-[#1C1C1C]">Page {Math.floor(Math.random() * 10) + 1}</span>: "
                          <span dangerouslySetInnerHTML={{
                            __html: resource.mockIndexedText.substring(0, 80).replace(
                              new RegExp(`(${searchQuery})`, 'gi'), 
                              `<mark class="bg-[#EFE7D8] text-[#1F4D3A] font-bold">$1</mark>`
                            )
                          }} />
                          ..."
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default ResourceBrowse;