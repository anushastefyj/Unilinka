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

const ResourceBrowse = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
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
    const token = localStorage.getItem('authToken');
    const role = localStorage.getItem('userRole');
    
    if (token) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    const history = JSON.parse(localStorage.getItem('downloadHistory') || '[]');
    setDownloadHistory(history);
  }, []);

  const mockResources = [
    {
      id: 1,
      title: "Introduction to Data Structures and Algorithms",
      description: "Comprehensive guide covering fundamental data structures including arrays, linked lists, stacks, queues, trees, and graphs. Includes implementation examples and complexity analysis for common operations.",
      subject: "Computer Science",
      fileType: "PDF",
      fileSize: "4.2 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-20T10:30:00",
      uploadedBy: "Dr. Sarah Mitchell",
      facultyVerified: true,
      isFeatured: true,
      downloadCount: 342,
      tags: ["algorithms", "data structures", "programming", "computer science"],
      facultyRecommendation: "Essential reading for CS students. Clear explanations with practical examples that build strong foundational knowledge."
    },
    {
      id: 2,
      title: "Calculus II: Integration Techniques and Applications",
      description: "Advanced integration methods including substitution, integration by parts, partial fractions, and trigonometric substitution. Features solved examples and practice problems with detailed solutions.",
      subject: "Mathematics",
      fileType: "PDF",
      fileSize: "3.8 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-18T14:20:00",
      uploadedBy: "Prof. James Anderson",
      facultyVerified: true,
      isFeatured: true,
      downloadCount: 289,
      tags: ["calculus", "integration", "mathematics", "analysis"],
      facultyRecommendation: "Excellent resource with step-by-step solutions. Highly recommended for mastering integration techniques."
    },
    {
      id: 3,
      title: "Quantum Mechanics Fundamentals Presentation",
      description: "Visual presentation covering wave-particle duality, Schrödinger equation, quantum states, and measurement theory. Includes animations and interactive diagrams for better understanding.",
      subject: "Physics",
      fileType: "PPT",
      fileSize: "12.5 MB",
      academicLevel: "Graduate",
      uploadDate: "2025-12-15T09:45:00",
      uploadedBy: "Dr. Emily Chen",
      facultyVerified: true,
      isFeatured: true,
      downloadCount: 256,
      tags: ["quantum mechanics", "physics", "wave functions", "quantum theory"],
      facultyRecommendation: "Outstanding visual presentation that makes complex quantum concepts accessible. Great for both learning and teaching."
    },
    {
      id: 4,
      title: "Organic Chemistry Reaction Mechanisms",
      description: "Detailed study of organic reaction mechanisms including nucleophilic substitution, elimination reactions, addition reactions, and rearrangements. Contains reaction schemes and mechanistic pathways.",
      subject: "Chemistry",
      fileType: "DOC",
      fileSize: "2.1 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-22T11:15:00",
      uploadedBy: "Prof. Michael Roberts",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 198,
      tags: ["organic chemistry", "reactions", "mechanisms", "synthesis"]
    },
    {
      id: 5,
      title: "Cell Biology and Molecular Genetics",
      description: "Comprehensive coverage of cell structure, function, and molecular genetics. Includes detailed diagrams of cellular processes, DNA replication, transcription, and translation mechanisms.",
      subject: "Biology",
      fileType: "PDF",
      fileSize: "5.7 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-19T16:30:00",
      uploadedBy: "Dr. Lisa Thompson",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 234,
      tags: ["cell biology", "genetics", "molecular biology", "DNA"]
    },
    {
      id: 6,
      title: "Shakespeare\'s Tragedies: Literary Analysis",
      description: "In-depth analysis of Shakespeare's major tragedies including Hamlet, Macbeth, Othello, and King Lear. Explores themes, character development, and historical context with critical interpretations.",
      subject: "English Literature",
      fileType: "PDF",
      fileSize: "3.2 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-17T13:00:00",
      uploadedBy: "Prof. David Wilson",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 167,
      tags: ["shakespeare", "literature", "drama", "tragedy", "analysis"]
    },
    {
      id: 7,
      title: "World War II: Causes and Consequences",
      description: "Comprehensive historical analysis of World War II covering political, economic, and social factors. Includes primary source documents, maps, and timeline of major events from 1939-1945.",
      subject: "History",
      fileType: "PPT",
      fileSize: "8.9 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-21T10:00:00",
      uploadedBy: "Dr. Robert Martinez",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 203,
      tags: ["world war II", "history", "20th century", "warfare"]
    },
    {
      id: 8,
      title: "Microeconomics: Supply and Demand Analysis",
      description: "Fundamental concepts of microeconomics focusing on supply and demand theory, market equilibrium, elasticity, and consumer behavior. Features real-world examples and graphical analysis.",
      subject: "Economics",
      fileType: "PDF",
      fileSize: "2.8 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-16T15:45:00",
      uploadedBy: "Prof. Jennifer Lee",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 178,
      tags: ["microeconomics", "supply and demand", "markets", "economics"]
    },
    {
      id: 9,
      title: "Machine Learning Algorithms Overview",
      description: "Introduction to supervised and unsupervised learning algorithms including linear regression, decision trees, neural networks, and clustering methods. Contains Python code examples and datasets.",
      subject: "Computer Science",
      fileType: "PDF",
      fileSize: "6.4 MB",
      academicLevel: "Graduate",
      uploadDate: "2025-12-23T09:30:00",
      uploadedBy: "Dr. Alex Kumar",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 312,
      tags: ["machine learning", "AI", "algorithms", "data science"]
    },
    {
      id: 10,
      title: "Linear Algebra: Matrices and Vector Spaces",
      description: "Complete guide to linear algebra covering matrix operations, determinants, eigenvalues, eigenvectors, and vector spaces. Includes theoretical foundations and practical applications.",
      subject: "Mathematics",
      fileType: "DOC",
      fileSize: "3.5 MB",
      academicLevel: "Undergraduate",
      uploadDate: "2025-12-14T12:20:00",
      uploadedBy: "Prof. Maria Garcia",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 245,
      tags: ["linear algebra", "matrices", "vectors", "mathematics"]
    },
    {
      id: 11,
      title: "Thermodynamics and Statistical Mechanics",
      description: "Advanced physics covering laws of thermodynamics, entropy, free energy, and statistical mechanics principles. Includes derivations and problem-solving strategies.",
      subject: "Physics",
      fileType: "PDF",
      fileSize: "4.9 MB",
      academicLevel: "Graduate",
      uploadDate: "2025-12-13T14:00:00",
      uploadedBy: "Dr. Thomas Brown",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 189,
      tags: ["thermodynamics", "statistical mechanics", "physics", "entropy"]
    },
    {
      id: 12,
      title: "Biochemistry: Protein Structure and Function",
      description: "Detailed study of protein chemistry including amino acids, peptide bonds, protein folding, and enzyme kinetics. Features 3D molecular structures and reaction mechanisms.",
      subject: "Chemistry",
      fileType: "PPT",
      fileSize: "11.2 MB",
      academicLevel: "Graduate",
      uploadDate: "2025-12-12T11:30:00",
      uploadedBy: "Prof. Rachel Green",
      facultyVerified: true,
      isFeatured: false,
      downloadCount: 221,
      tags: ["biochemistry", "proteins", "enzymes", "molecular biology"]
    }
  ];

  const subjects = [
    { id: 1, name: 'All Subjects', icon: 'BookOpen', count: mockResources?.length, hasNew: false },
    { id: 2, name: 'Computer Science', icon: 'Code', count: 2, hasNew: true },
    { id: 3, name: 'Mathematics', icon: 'Calculator', count: 2, hasNew: false },
    { id: 4, name: 'Physics', icon: 'Atom', count: 2, hasNew: true },
    { id: 5, name: 'Chemistry', icon: 'FlaskConical', count: 2, hasNew: false },
    { id: 6, name: 'Biology', icon: 'Microscope', count: 1, hasNew: false },
    { id: 7, name: 'English Literature', icon: 'BookText', count: 1, hasNew: false },
    { id: 8, name: 'History', icon: 'Landmark', count: 1, hasNew: false },
    { id: 9, name: 'Economics', icon: 'TrendingUp', count: 1, hasNew: false }
  ];

  const getFilteredResources = () => {
    let filtered = [...mockResources];

    if (searchQuery) {
      const query = searchQuery?.toLowerCase();
      filtered = filtered?.filter(resource =>
        resource?.title?.toLowerCase()?.includes(query) ||
        resource?.description?.toLowerCase()?.includes(query) ||
        resource?.tags?.some(tag => tag?.toLowerCase()?.includes(query))
      );
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
  const featuredResources = mockResources?.filter(r => r?.isFeatured)?.slice(0, 3);

  const handleDownload = (resource) => {
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

    const link = document.createElement('a');
    link.href = '#';
    link.download = `${resource?.title}.${resource?.fileType?.toLowerCase()}`;
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
      subject: 'all',
      fileTypes: [],
      academicLevels: [],
      sortBy: 'recent',
      verifiedOnly: false,
      featuredOnly: false
    });
    setSearchQuery('');
  };

  const handleSubjectChange = (subjectName) => {
    setFilters({ ...filters, subject: subjectName === 'All Subjects' ? 'all' : subjectName });
  };

  return (
    <div className="min-h-screen bg-background">
      <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
      <div className="pt-16 md:pt-20">
        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border-b border-border">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Browse Academic Resources
            </h1>
            <p className="text-base md:text-lg text-muted-foreground max-w-3xl">
              Discover verified study materials shared by students and faculty. Access quality educational content across multiple subjects and formats.
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-6 md:py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <SubjectSidebar
              subjects={subjects}
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

                {(searchQuery || filters?.subject !== 'all' || filters?.fileTypes?.length > 0 || 
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
                  All Resources
                  <span className="ml-2 text-base text-muted-foreground">
                    ({filteredResources?.length})
                  </span>
                </h2>
              </div>

              {filteredResources?.length === 0 ? (
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