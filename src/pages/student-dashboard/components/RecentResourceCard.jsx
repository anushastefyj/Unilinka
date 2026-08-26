import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import ResourcePreviewModal from '../../../components/ui/ResourcePreviewModal';
import ReportIssueModal from '../../../components/ui/ReportIssueModal';

const RecentResourceCard = ({ resource }) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);

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
    
    // Also log this to localStorage for "My Downloads"
    try {
      const history = JSON.parse(localStorage.getItem('unilinka_downloads') || '[]');
      // Avoid exact duplicates back-to-back
      if (history.length === 0 || history[0].id !== resource.id) {
        const newEntry = { ...resource, downloadDate: Date.now() };
        localStorage.setItem('unilinka_downloads', JSON.stringify([newEntry, ...history].slice(0, 50)));
      }
    } catch (e) {
      console.error("Error saving download history", e);
    }

    window.open(resource.fileUrl, '_blank');
  };

  // Generate a mock file size if not available in DB
  const mockSize = ((resource.title?.length || 10) * 0.4).toFixed(1);

  return (
    <>
      <div className="bg-white border border-[#E7E2D6] rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center gap-4 relative">
        <div className="bg-[#EFE7D8] rounded-xl p-3 flex-shrink-0 self-start sm:self-center">
          <Icon name={getFileIcon(resource.fileType)} size={24} className="text-[#1F4D3A]" />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-[#1C1C1C] mb-1 truncate group-hover:text-[#1F4D3A] transition-colors cursor-pointer" onClick={() => setIsPreviewOpen(true)}>
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
        
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mt-3 sm:mt-0 self-start sm:self-center w-full sm:w-auto">
          <div className="text-xs text-[#5C5C5C] whitespace-nowrap hidden sm:block">
            Added {formatDate(resource.uploadDate)}
          </div>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setIsReportOpen(true)}
              className="w-10 h-10 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center flex-shrink-0"
              title="Report Issue"
            >
              <Icon name="Flag" size={16} />
            </button>
            <button 
              onClick={() => setIsPreviewOpen(true)}
              disabled={!resource.fileUrl}
              className="w-12 h-10 bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#1F4D3A] rounded-xl transition-colors border border-[#E7E2D6] flex items-center justify-center flex-shrink-0 disabled:opacity-50"
              title="Preview File"
            >
              <Icon name="Eye" size={16} />
            </button>
            <button 
              onClick={handleDownload}
              disabled={!resource.fileUrl}
              className="flex-1 sm:flex-initial sm:w-auto bg-[#FAF7F0] hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white rounded-xl px-4 py-2 h-10 transition-colors border border-[#E7E2D6] hover:border-[#1F4D3A] flex items-center justify-center gap-2 font-bold text-sm disabled:opacity-50"
              title="Download File"
            >
              <Icon name="Download" size={16} />
              <span className="hidden sm:inline">Download</span>
              <span className="sm:hidden">PDF • {mockSize}MB</span>
            </button>
          </div>
        </div>
      </div>

      {isPreviewOpen && (
        <ResourcePreviewModal 
          resource={resource} 
          onClose={() => setIsPreviewOpen(false)} 
        />
      )}
      
      {isReportOpen && (
        <ReportIssueModal 
          resource={resource}
          onClose={() => setIsReportOpen(false)}
        />
      )}
    </>
  );
};

export default RecentResourceCard;
