import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import Select from '../../../components/ui/Select';
import { ACADEMIC_YEARS } from '../../../config/curriculum';

const FilterPanel = ({ 
  filters, 
  onFilterChange, 
  onClearFilters, 
  resultCount,
  isOpen,
  onClose,
  subjects
}) => {
  const academicYears = ACADEMIC_YEARS;

  const fileTypes = [
    { value: 'PDF', label: 'PDF Documents' },
    { value: 'PPT', label: 'Presentations' },
    { value: 'DOC', label: 'Word Documents' }
  ];

  const sortOptions = [
    { value: 'recent', label: 'Most Recent' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'title', label: 'Title (A-Z)' }
  ];

  const handleYearChange = (value) => {
    onFilterChange({ ...filters, academicYear: value, subject: 'all' });
  };

  const handleSubjectChange = (subjectName) => {
    onFilterChange({ ...filters, subject: subjectName === 'All Subjects' ? 'all' : subjectName });
  };

  const handleFileTypeToggle = (fileType) => {
    const currentTypes = filters?.fileTypes || [];
    const newTypes = currentTypes?.includes(fileType)
      ? currentTypes?.filter(t => t !== fileType)
      : [...currentTypes, fileType];
    onFilterChange({ ...filters, fileTypes: newTypes });
  };

  const handleVerifiedToggle = () => {
    onFilterChange({ ...filters, verifiedOnly: !filters.verifiedOnly });
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <div className={`
        fixed lg:sticky top-0 left-0 h-screen lg:h-[calc(100vh-5rem)]
        w-72 sm:w-80 lg:w-72 xl:w-80
        bg-white border-r lg:border-r-0 lg:border border-gray-200
        rounded-none lg:rounded-2xl
        flex flex-col
        z-50 lg:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Icon name="SlidersHorizontal" size={18} className="text-[#135ea2]" />
            Filters
          </h2>
          <button
            onClick={onClose}
            className="lg:hidden p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-8">
          
          {/* Academic Year */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Academic Year</h3>
            <Select
              options={academicYears}
              value={filters?.academicYear || 'All Years'}
              onChange={handleYearChange}
            />
          </section>
          
          {/* Sort By */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Sort By</h3>
            <Select
              options={sortOptions}
              value={filters?.sortBy || 'recent'}
              onChange={(value) => onFilterChange({ ...filters, sortBy: value })}
            />
          </section>

          {/* Subjects List */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider flex items-center justify-between">
              Subjects
              <span className="bg-gray-100 text-gray-600 text-xs py-0.5 px-2 rounded-full">
                {subjects?.length - 1}
              </span>
            </h3>
            <div className="space-y-1">
              {subjects?.map((subject) => {
                const isActive = (filters.subject === 'all' && subject.id === 'all') || filters.subject === subject.name;
                return (
                  <button
                    key={subject.id}
                    onClick={() => handleSubjectChange(subject.name)}
                    className={`
                      w-full flex items-center justify-between
                      px-3 py-2 rounded-lg
                      text-sm font-medium
                      transition-colors
                      ${isActive
                        ? 'bg-[#135ea2]/10 text-[#135ea2]'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }
                    `}
                  >
                    <span className="truncate pr-2">{subject.name}</span>
                    <span className={`
                      text-xs px-2 py-0.5 rounded-full flex-shrink-0
                      ${isActive
                        ? 'bg-[#135ea2]/20 text-[#135ea2]'
                        : 'bg-gray-100 text-gray-500'
                      }
                    `}>
                      {subject.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

          {/* File Types */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">File Type</h3>
            <div className="space-y-3">
              {fileTypes.map((type) => {
                const isChecked = (filters?.fileTypes || []).includes(type.value);
                return (
                  <label key={type.value} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`
                      w-5 h-5 rounded border flex items-center justify-center transition-colors
                      ${isChecked ? 'bg-[#135ea2] border-[#135ea2]' : 'border-gray-300 group-hover:border-[#135ea2] bg-white'}
                    `}>
                      {isChecked && <Icon name="Check" size={14} className="text-white" />}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{type.label}</span>
                  </label>
                );
              })}
            </div>
          </section>
          
          {/* Other Filters */}
          <section>
            <h3 className="text-sm font-semibold text-gray-900 mb-3 uppercase tracking-wider">Other</h3>
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`
                w-5 h-5 rounded border flex items-center justify-center transition-colors
                ${filters?.verifiedOnly ? 'bg-emerald-600 border-emerald-600' : 'border-gray-300 group-hover:border-emerald-600 bg-white'}
              `}>
                {filters?.verifiedOnly && <Icon name="Check" size={14} className="text-white" />}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-700">Faculty Verified</span>
                <span className="text-xs text-gray-500">Show only verified resources</span>
              </div>
            </label>
          </section>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-gray-50 flex-shrink-0 lg:rounded-b-2xl">
          <button
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            <Icon name="RotateCcw" size={16} />
            Reset all filters
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;