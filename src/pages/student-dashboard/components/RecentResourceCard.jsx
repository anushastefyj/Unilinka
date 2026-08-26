import React from 'react';
import Icon from '../../../components/AppIcon';
import { useAuth } from '../../../contexts/AuthContext';

const RecentResourceCard = ({ resource }) => {
  const { userData } = useAuth();
  
  const getFileIcon = (type) => {
    const icons = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return icons[type] || 'File';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const isUploader = userData?.id === resource.uploaderId;
  const isApproved = resource.status === 'approved' || !resource.status; // defaults to approved if not specified
  const isPending = resource.status === 'pending';

  // Permission logic:
  // Approved resources: downloadable by anyone.
  // Pending/Rejected resources: downloadable ONLY by the uploader.
  // Note: The parent component should only pass pending/rejected if the user IS the uploader, 
  // but we double check here just in case.
  const canDownload = isApproved || isUploader;

  const handleDownload = () => {
    if (!canDownload || !resource.fileUrl) return;
    
    // Open in new tab (browser will handle PDF view/download)
    window.open(resource.fileUrl, '_blank');
  };

  return (
    <div className="bg-white border border-[#E7E2D6] rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col sm:flex-row sm:items-center gap-4 relative">
      <div className="bg-[#EFE7D8] rounded-xl p-3 flex-shrink-0 self-start sm:self-center">
        <Icon name={getFileIcon(resource.fileType)} size={24} className="text-[#1F4D3A]" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="text-base font-bold text-[#1C1C1C] truncate group-hover:text-[#1F4D3A] transition-colors">
            {resource.title}
          </h3>
          {isPending && (
            <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Pending
            </span>
          )}
        </div>
        
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
      
      <div className="flex items-center gap-4 mt-2 sm:mt-0 self-start sm:self-center">
        <div className="text-xs text-gray-400 whitespace-nowrap">
          {formatDate(resource.uploadDate)}
        </div>
        
        {canDownload ? (
          <button 
            onClick={handleDownload}
            className="bg-[#FAF7F0] hover:bg-[#1F4D3A] text-[#1F4D3A] hover:text-white rounded-xl p-2 transition-colors border border-[#E7E2D6] hover:border-[#1F4D3A]"
            aria-label="Download resource"
            title="Download PDF"
          >
            <Icon name="Download" size={18} />
          </button>
        ) : (
          <button 
            disabled
            className="bg-gray-100 text-gray-300 rounded-xl p-2 cursor-not-allowed border border-gray-100"
            aria-label="Awaiting approval"
            title="Awaiting approval"
          >
            <Icon name="Lock" size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default RecentResourceCard;
