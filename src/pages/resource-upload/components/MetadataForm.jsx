import React from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const MetadataForm = ({ formData, onChange, errors }) => {
  const subjectOptions = [
    { value: 'mathematics', label: 'Mathematics' },
    { value: 'physics', label: 'Physics' },
    { value: 'chemistry', label: 'Chemistry' },
    { value: 'biology', label: 'Biology' },
    { value: 'computer-science', label: 'Computer Science' },
    { value: 'engineering', label: 'Engineering' },
    { value: 'literature', label: 'Literature' },
    { value: 'history', label: 'History' },
    { value: 'economics', label: 'Economics' },
    { value: 'business', label: 'Business Administration' }
  ];

  const academicLevelOptions = [
    { value: 'undergraduate-year1', label: 'Undergraduate - Year 1' },
    { value: 'undergraduate-year2', label: 'Undergraduate - Year 2' },
    { value: 'undergraduate-year3', label: 'Undergraduate - Year 3' },
    { value: 'undergraduate-year4', label: 'Undergraduate - Year 4' },
    { value: 'graduate', label: 'Graduate Level' },
    { value: 'postgraduate', label: 'Postgraduate Level' }
  ];

  const handleChange = (field, value) => {
    onChange({ ...formData, [field]: value });
  };

  return (
    <div className="space-y-4 md:space-y-6">
      <Input
        label="Resource Title"
        type="text"
        placeholder="Enter a descriptive title for your resource"
        value={formData?.title}
        onChange={(e) => handleChange('title', e?.target?.value)}
        error={errors?.title}
        required
      />
      <Select
        label="Subject Category"
        placeholder="Select subject"
        options={subjectOptions}
        value={formData?.subject}
        onChange={(value) => handleChange('subject', value)}
        error={errors?.subject}
        required
        searchable
      />
      <div>
        <label className="block text-sm font-medium text-[var(--color-foreground)] mb-2">
          Description <span className="text-[var(--color-error)]">*</span>
        </label>
        <textarea
          placeholder="Provide a detailed description of the resource content, topics covered, and learning objectives"
          value={formData?.description}
          onChange={(e) => handleChange('description', e?.target?.value)}
          rows={4}
          className="w-full px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] placeholder:text-[var(--color-muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] transition-all duration-250 resize-none"
        />
        {errors?.description && (
          <p className="mt-1 text-sm text-[var(--color-error)]">{errors?.description}</p>
        )}
      </div>
      <Select
        label="Academic Level"
        placeholder="Select academic level"
        options={academicLevelOptions}
        value={formData?.academicLevel}
        onChange={(value) => handleChange('academicLevel', value)}
        error={errors?.academicLevel}
        required
      />
      <Input
        label="Course Tags"
        type="text"
        placeholder="Enter tags separated by commas (e.g., calculus, derivatives, integration)"
        value={formData?.tags}
        onChange={(e) => handleChange('tags', e?.target?.value)}
        description="Add relevant keywords to help others find your resource"
        error={errors?.tags}
      />
    </div>
  );
};

export default MetadataForm;