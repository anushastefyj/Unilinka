import React, { useMemo } from 'react';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { ACADEMIC_YEARS, SUBJECTS_BY_YEAR } from '../../../config/curriculum';

const MetadataForm = ({ formData, onChange, errors }) => {

  const academicYearOptions = ACADEMIC_YEARS.filter(y => y.id !== 'all').map(y => ({
    value: y.value,
    label: y.label
  }));

  const subjectOptions = useMemo(() => {
    if (!formData.academicYear) return [];
    const subjects = SUBJECTS_BY_YEAR[formData.academicYear] || [];
    return subjects.map(s => ({ value: s, label: s }));
  }, [formData.academicYear]);

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Select
          label="Academic Year"
          placeholder="Select academic year"
          options={academicYearOptions}
          value={formData?.academicYear}
          onChange={(value) => handleChange('academicYear', value)}
          error={errors?.academicYear}
          required
        />

        <Select
          label="Subject Category"
          placeholder={formData.academicYear ? "Select subject" : "Select an academic year first"}
          options={subjectOptions}
          value={formData?.subject}
          onChange={(value) => handleChange('subject', value)}
          error={errors?.subject}
          required
          searchable
          disabled={!formData.academicYear}
        />
      </div>

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
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
          placeholder="Enter tags (e.g., calculus, derivatives)"
          value={formData?.tags}
          onChange={(e) => handleChange('tags', e?.target?.value)}
          description="Add relevant keywords to help others find your resource"
          error={errors?.tags}
        />
      </div>
    </div>
  );
};

export default MetadataForm;