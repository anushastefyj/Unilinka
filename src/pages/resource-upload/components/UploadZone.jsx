
import React, { useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const UploadZone = ({ onFilesSelected, acceptedFormats, maxFileSize }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    e?.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e?.dataTransfer?.files);
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = Array.from(e?.target?.files);
    handleFiles(files);
  };

  const handleFiles = (files) => {
    const validFiles = files?.filter(file => {
      const extension = file?.name?.split('.')?.pop()?.toLowerCase();
      const isValidFormat = acceptedFormats?.includes(extension);
      const isValidSize = file?.size <= maxFileSize;
      return isValidFormat && isValidSize;
    });

    if (validFiles?.length > 0) {
      onFilesSelected(validFiles);
    }

    if (validFiles?.length < files?.length) {
      alert(`Some files were rejected. Please ensure files are in ${acceptedFormats?.join(', ')} format and under ${Math.round(maxFileSize / (1024 * 1024))}MB.`);
    }
  };

  const handleClick = () => {
    fileInputRef?.current?.click();
  };

  return (
    <div
      className={`relative border-2 border-dashed rounded-xl transition-all duration-250 cursor-pointer ${
        isDragging
          ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/5'
          : 'border-[var(--color-border)] hover:border-[var(--color-primary)] hover:bg-[var(--color-muted)]'
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
      style={{ padding: '48px 24px' }}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".pdf,.ppt,.pptx,.doc,.docx"
        onChange={handleFileInput}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center gap-4 md:gap-6">
        <div
          className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center transition-all duration-250 ${
            isDragging
              ? 'bg-[var(--color-primary)] text-[var(--color-primary-foreground)]'
              : 'bg-[var(--color-muted)] text-[var(--color-primary)]'
          }`}
        >
          <Icon name="Upload" size={32} />
        </div>

        <div className="text-center">
          <h3 className="text-lg md:text-xl font-semibold text-[var(--color-foreground)] mb-2">
            {isDragging ? 'Drop files here' : 'Drag & drop files here'}
          </h3>
          <p className="text-sm md:text-base text-[var(--color-muted-foreground)] mb-4">
            or click to browse from your device
          </p>

          <div className="flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm text-[var(--color-muted-foreground)]">
            <div className="flex items-center gap-1">
              <Icon name="FileText" size={16} />
              <span>PDF</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Icon name="Presentation" size={16} />
              <span>PPT</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Icon name="FileType" size={16} />
              <span>DOC</span>
            </div>
            <span>•</span>
            <span>Max {Math.round(maxFileSize / (1024 * 1024))}MB</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadZone;