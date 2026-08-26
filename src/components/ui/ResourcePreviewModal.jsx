import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const ResourcePreviewModal = ({ resource, onClose }) => {
  useEffect(() => {
    // Prevent background scrolling
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  if (!resource) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl h-full bg-white rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E7E2D6]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E7E2D6] bg-[#FAF7F0]">
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] flex-shrink-0">
              <Icon name="FileText" size={20} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-bold text-[#1C1C1C] truncate pr-4">
                {resource.title}
              </h2>
              <p className="text-xs text-[#5C5C5C] truncate">
                {resource.subject} • {resource.academicYear}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <button 
              onClick={() => {
                if (resource.fileUrl) window.open(resource.fileUrl, '_blank');
              }}
              disabled={!resource.fileUrl}
              className="hidden sm:flex bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white px-4 py-2 rounded-xl text-sm font-bold items-center gap-2 transition-colors disabled:opacity-50"
            >
              <Icon name="Download" size={16} />
              Download
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-full text-gray-500 hover:bg-[#EFE7D8] hover:text-[#1C1C1C] transition-colors"
            >
              <Icon name="X" size={24} />
            </button>
          </div>
        </div>

        {/* Content Body - Iframe / Placeholder */}
        <div className="flex-1 bg-gray-100 relative overflow-hidden flex items-center justify-center">
          {resource.fileUrl ? (
            <iframe 
              src={`${resource.fileUrl}#toolbar=0`} 
              className="w-full h-full border-0"
              title={`Preview of ${resource.title}`}
            />
          ) : (
            <div className="text-center p-8">
              <Icon name="FileWarning" size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-bold text-[#1C1C1C] mb-2">No File Available</h3>
              <p className="text-[#5C5C5C]">This resource does not have a valid file attached for previewing.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResourcePreviewModal;
