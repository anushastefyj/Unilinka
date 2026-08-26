import React from 'react';
import Icon from '../../../components/AppIcon';

const ResourceCard = ({ resource, onDownload, onViewDetails }) => {
  const getFileIcon = (fileType) => {
    const iconMap = {
      'PDF': 'FileText',
      'PPT': 'Presentation',
      'DOC': 'FileType'
    };
    return iconMap[fileType] || 'File';
  };

  const getFileColor = (fileType) => {
    const colorMap = {
      'PDF': 'bg-red-50 text-red-600 border-red-200',
      'PPT': 'bg-amber-50 text-amber-600 border-amber-200',
      'DOC': 'bg-blue-50 text-blue-600 border-blue-200'
    };
    return colorMap[fileType] || 'bg-gray-50 text-gray-600 border-gray-200';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition-shadow group flex flex-col h-full">
      <div className="flex items-start gap-4 mb-3">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border flex-shrink-0 ${getFileColor(resource?.fileType)}`}>
          <Icon name={getFileIcon(resource?.fileType)} size={24} />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#135ea2] transition-colors cursor-pointer" onClick={() => onViewDetails(resource)}>
            {resource?.title}
          </h3>
          <p className="text-sm text-gray-500 truncate">
            {resource?.subject}
          </p>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2 flex-grow">
        {resource?.description}
      </p>
      
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
          <Icon name="Calendar" size={14} />
          {resource?.academicYear}
        </span>
        <span className="inline-flex items-center gap-1.5 px-2 py-1 bg-gray-100 border border-gray-200 rounded-md text-xs font-medium text-gray-700">
          <Icon name="User" size={14} />
          {resource?.uploadedBy}
        </span>
      </div>
      
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-4 text-xs font-medium text-gray-500">
          <span className="flex items-center gap-1.5">
            <Icon name="Clock" size={14} />
            {formatDate(resource?.uploadDate)}
          </span>
          <span className="flex items-center gap-1.5">
            <Icon name="Download" size={14} />
            {resource?.downloadCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewDetails(resource)}
            className="p-2 text-gray-400 hover:text-[#135ea2] hover:bg-[#135ea2]/10 rounded-lg transition-colors"
            aria-label="View Details"
          >
            <Icon name="Eye" size={18} />
          </button>
          <button
            onClick={() => onDownload(resource)}
            className="p-2 text-gray-400 hover:text-[#135ea2] hover:bg-[#135ea2]/10 rounded-lg transition-colors"
            aria-label="Download"
          >
            <Icon name="DownloadCloud" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResourceCard;