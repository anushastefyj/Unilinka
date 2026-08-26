import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import DownloadTruckButton from '../../../components/ui/DownloadTruckButton';

const ResourceDetailModal = ({ resource, isOpen, onClose, onDownload }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  if (!isOpen || !resource) return null;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

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
      'PDF': 'bg-red-50 text-red-600',
      'PPT': 'bg-amber-50 text-amber-600',
      'DOC': 'bg-blue-50 text-blue-600'
    };
    return colorMap[fileType] || 'bg-gray-50 text-gray-600';
  };

  const handleDownloadSequence = () => {
    setIsDownloading(true);
    // Let the animation play a bit before actually triggering the download file
    // The truck animation takes about 1.4s to finish "driving off"
    setTimeout(() => {
      onDownload(resource);
      setIsDownloading(false);
    }, 1400); 
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-gray-900/60 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden relative">
        
        {/* Header Strip */}
        <div className="h-32 bg-gradient-to-r from-gray-50 to-gray-100 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/50 hover:bg-white text-gray-600 transition-colors backdrop-blur-md"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content Wrapper */}
        <div className="px-6 sm:px-10 pb-8 flex-1 overflow-y-auto -mt-12 relative z-10">
          
          {/* Main Icon & Title */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-8">
            <div className={`w-24 h-24 rounded-2xl flex items-center justify-center border-4 border-white shadow-sm flex-shrink-0 ${getFileColor(resource.fileType)}`}>
              <Icon name={getFileIcon(resource.fileType)} size={40} />
            </div>
            
            <div className="flex-1 pb-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-[#135ea2]/10 text-[#135ea2] text-xs font-bold px-2.5 py-1 rounded-md">
                  {resource.academicYear}
                </span>
                <span className="bg-gray-100 text-gray-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  {resource.subject}
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                {resource.title}
              </h2>
            </div>
          </div>

          <div className="space-y-8">
            
            {/* Description */}
            <section>
              <h3 className="text-sm font-semibold text-gray-900 mb-2">About this resource</h3>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {resource.description || "No description provided by the uploader."}
              </p>
            </section>

            {/* Metadata Grid */}
            <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Icon name="User" size={18} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium mb-1">Uploaded By</p>
                <p className="text-sm font-semibold text-gray-900 truncate">{resource.uploadedBy}</p>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Icon name="Calendar" size={18} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-900">{formatDate(resource.uploadDate)}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Icon name="FileType" size={18} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium mb-1">Format</p>
                <p className="text-sm font-semibold text-gray-900">{resource.fileType || 'Document'}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <Icon name="Download" size={18} className="text-gray-400 mb-2" />
                <p className="text-xs text-gray-500 font-medium mb-1">Downloads</p>
                <p className="text-sm font-semibold text-gray-900">{resource.downloadCount}</p>
              </div>
            </section>
            
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-6 sm:px-10 border-t border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-6 items-center justify-between">
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-8 py-3 rounded-xl font-medium text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Close
          </button>
          
          <div className="flex-shrink-0">
            <DownloadTruckButton 
              onDownload={handleDownloadSequence} 
              isDownloading={isDownloading} 
            />
          </div>
        </div>

      </div>
    </div>
  );
};

export default ResourceDetailModal;