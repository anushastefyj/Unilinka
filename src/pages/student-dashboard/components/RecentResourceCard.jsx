import React from 'react';
import Icon from '../../../components/AppIcon';

const RecentResourceCard = ({ resource }) => {
  const getFileIcon = (type) => {
    const icons = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType',
      'DOCX': 'FileType'
    };
    return icons[type?.toUpperCase()] || 'File';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const handleDownload = () => {
    if (!resource.fileUrl) return;
    window.open(resource.fileUrl, '_blank');
  };

  // Generate a mock file size if not available in DB
  const mockSize = ((resource.title?.length || 10) * 0.4).toFixed(1);

  return (
    <div className="bg-white border border-[#E7E2D6] rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center gap-4 relative">
      <div className="bg-[#EFE7D8] rounded-xl p-3 flex-shrink-0 self-start sm:self-center">
        <Icon name={getFileIcon(resource.fileType)} size={24} className="text-[#1F4D3A]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-base font-bold text-[#1C1C1C] mb-1 truncate group-hover:text-[#1F4D3A] transition-colors">
          {resource.title}
        </h3>
        
        {resource.description && (
          <p className="text-sm text-[#5C5C5C] mb-2 line-clamp-1">
            {resource.description}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#5C5C5C]">
          <span className="bg-[#EFE7D8] text-[#1F4D3A] px-2 py-0.5 rounded-md">
            {resource.fileType || 'FILE'}
          </span>
          <span>•</span>
          <span className="truncate max-w-[120px] sm:max-w-none">{resource.subject}</span>
          <span>•</span>
          <span>{resource.academicYear}</span>
        </div>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 mt-3 sm:mt-0 self-start sm:self-center w-full sm:w-auto">
        <div className="text-xs text-[#5C5C5C] whitespace-nowrap hidden sm:block">
          Added {formatDate(resource.uploadDate)}
        </div>
        
        <button 
          onClick={handleDownload}
          disabled={!resource.fileUrl}
          className="w-full sm:w-auto bg-[#FAF7F0] hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white rounded-xl px-4 py-2 transition-colors border border-[#E7E2D6] hover:border-[#1F4D3A] flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
          title="Download File"
        >
          <Icon name="Download" size={16} />
          <span>Download {resource.fileType} • {mockSize}MB</span>
        </button>
      </div>
    </div>
  );
};

export default RecentResourceCard;
