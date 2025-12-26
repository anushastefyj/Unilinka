import React from 'react';
import Select from '../../../components/ui/Select';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';

const FilterControls = ({ filters, onFilterChange, onReset, resultCount }) => {
  const subjectOptions = [
    { value: 'all', label: 'All Subjects' },
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'english', label: 'English Literature' },
    { value: 'history', label: 'History' }
  ];

  const fileTypeOptions = [
    { value: 'all', label: 'All File Types' },
    { value: 'pdf', label: 'PDF Documents' },
    { value: 'ppt', label: 'PowerPoint Presentations' },
    { value: 'doc', label: 'Word Documents' }
  ];

  const sortOptions = [
    { value: 'date-desc', label: 'Newest First' },
    { value: 'date-asc', label: 'Oldest First' },
    { value: 'priority-high', label: 'High Priority' },
    { value: 'priority-low', label: 'Low Priority' }
  ];

  const priorityOptions = [
    { value: 'all', label: 'All Priorities' },
    { value: 'high', label: 'High Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'low', label: 'Low Priority' }
  ];

  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-academic">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 md:mb-6">
        <h3 className="text-lg md:text-xl font-semibold text-foreground">
          Filter Resources
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-sm md:text-base text-muted-foreground caption">
            {resultCount} resources found
          </span>
          <Button
            variant="outline"
            size="sm"
            iconName="RotateCcw"
            iconPosition="left"
            onClick={onReset}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Select
          label="Subject"
          options={subjectOptions}
          value={filters?.subject}
          onChange={(value) => onFilterChange('subject', value)}
        />

        <Select
          label="File Type"
          options={fileTypeOptions}
          value={filters?.fileType}
          onChange={(value) => onFilterChange('fileType', value)}
        />

        <Select
          label="Priority"
          options={priorityOptions}
          value={filters?.priority}
          onChange={(value) => onFilterChange('priority', value)}
        />

        <Select
          label="Sort By"
          options={sortOptions}
          value={filters?.sortBy}
          onChange={(value) => onFilterChange('sortBy', value)}
        />
      </div>
      <div className="mt-4">
        <Input
          type="search"
          placeholder="Search by title or student name..."
          value={filters?.searchQuery}
          onChange={(e) => onFilterChange('searchQuery', e?.target?.value)}
        />
      </div>
    </div>
  );
};

export default FilterControls;