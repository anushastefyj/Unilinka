import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Select from '../../../components/ui/Select';
import { Checkbox } from '../../../components/ui/Checkbox';
import { ACADEMIC_YEARS, SUBJECTS_BY_YEAR, getAllSubjects } from '../../../config/curriculum';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  resultCount,
  isOpen,
  onClose 
}) => {
  const academicYears = ACADEMIC_YEARS;

  const subjectOptions = useMemo(() => {
    let list = [];
    if (filters.academicYear === 'All Years') {
      list = getAllSubjects();
    } else {
      list = SUBJECTS_BY_YEAR[filters.academicYear] || [];
    }
    return [
      { value: 'all', label: 'All Subjects' },
      ...list.map(s => ({ value: s, label: s }))
    ];
  }, [filters.academicYear]);

  const fileTypes = [
    { value: 'PDF', label: 'PDF Documents' },
    { value: 'PPT', label: 'Presentations' },
    { value: 'DOC', label: 'Word Documents' }
  ];

  const academicLevels = [
    { value: 'Undergraduate', label: 'Undergraduate' },
    { value: 'Graduate', label: 'Graduate' },
    { value: 'Postgraduate', label: 'Postgraduate' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  const handleYearChange = (value) => {
    onFilterChange({ ...filters, academicYear: value, subject: 'all' });
  };

  const handleSubjectChange = (value) => {
    onFilterChange({ ...filters, subject: value });
  };

  const handleFileTypeToggle = (fileType) => {
    const currentTypes = filters?.fileTypes || [];
    const newTypes = currentTypes?.includes(fileType)
      ? currentTypes?.filter(t => t !== fileType)
      : [...currentTypes, fileType];
    onFilterChange({ ...filters, fileTypes: newTypes });
  };

  const handleLevelToggle = (level) => {
    const currentLevels = filters?.academicLevels || [];
    const newLevels = currentLevels?.includes(level)
      ? currentLevels?.filter(l => l !== level)
      : [...currentLevels, level];
    onFilterChange({ ...filters, academicLevels: newLevels });
  };

  const handleSortChange = (value) => {
    onFilterChange({ ...filters, sortBy: value });
  };

  const handleVerifiedToggle = (e) => {
    onFilterChange({ ...filters, verifiedOnly: e?.target?.checked });
  };

  const handleFeaturedToggle = (e) => {
    onFilterChange({ ...filters, featuredOnly: e?.target?.checked });
  };

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-auto
        w-80 lg:w-full
        bg-card border-r lg:border-r-0 lg:border border-border
        rounded-none lg:rounded-xl
        p-4 md:p-6
        overflow-y-auto
        z-50 lg:z-0
        transition-transform duration-300
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex items-center justify-between mb-6 lg:mb-4">
          <h2 className="text-lg md:text-xl font-semibold text-foreground flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={20} />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-lg hover:bg-muted"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="mb-4 p-3 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{resultCount}</span> resources found
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <Select
              label="Academic Year"
              options={academicYears}
              value={filters?.academicYear || 'All Years'}
              onChange={handleYearChange}
            />
          </div>

          <div>
            <Select
              label="Subject"
              options={subjectOptions}
              value={filters?.subject || 'all'}
              onChange={handleSubjectChange}
              searchable
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              File Type
            </label>
            <div className="space-y-2">
              {fileTypes?.map((type) => (
                <Checkbox
                  key={type?.value}
                  label={type?.label}
                  checked={(filters?.fileTypes || [])?.includes(type?.value)}
                  onChange={() => handleFileTypeToggle(type?.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              Academic Level
            </label>
            <div className="space-y-2">
              {academicLevels?.map((level) => (
                <Checkbox
                  key={level?.value}
                  label={level?.label}
                  checked={(filters?.academicLevels || [])?.includes(level?.value)}
                  onChange={() => handleLevelToggle(level?.value)}
                />
              ))}
            </div>
          </div>

          <div>
            <Select
              label="Sort By"
              options={sortOptions}
              value={filters?.sortBy || 'recent'}
              onChange={handleSortChange}
            />
          </div>

          <div className="space-y-2 pt-4 border-t border-border">
            <Checkbox
              label="Verified Only"
              description="Show only faculty-verified resources"
              checked={filters?.verifiedOnly || false}
              onChange={handleVerifiedToggle}
            />
            <Checkbox
              label="Featured Only"
              description="Show only featured resources"
              checked={filters?.featuredOnly || false}
              onChange={handleFeaturedToggle}
            />
          </div>

          <Button
            variant="outline"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onClearFilters}
            fullWidth
          >
            Clear All Filters
          </Button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;