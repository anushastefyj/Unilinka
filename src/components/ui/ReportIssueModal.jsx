import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const ReportIssueModal = ({ resource, subjectContext, onClose }) => {
  const [issueType, setIssueType] = useState('Broken Link');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = 'unset'; };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // MOCK SUBMISSION: In a real app, this inserts into a Supabase 'reports' table
    setTimeout(() => {
      console.log('Report Submitted:', {
        resourceId: resource?.id || null,
        resourceTitle: resource?.title || null,
        subject: subjectContext?.subject || resource?.subject || 'Unknown',
        issueType,
        note
      });
      
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
      }, 2000);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-[#E7E2D6] flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E7E2D6] bg-[#FAF7F0]">
          <h2 className="text-xl font-bold text-[#1C1C1C] font-serif flex items-center gap-2">
            <Icon name="Flag" size={20} className="text-[#1F4D3A]" />
            Report Issue
          </h2>
          <button onClick={onClose} className="p-2 -mr-2 text-gray-400 hover:text-[#1C1C1C] transition-colors rounded-full hover:bg-[#EFE7D8]">
            <Icon name="X" size={20} />
          </button>
        </div>

        {isSuccess ? (
          <div className="p-8 text-center bg-white flex-1 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-green-600 mb-4 mx-auto animate-in zoom-in duration-300">
              <Icon name="Check" size={32} />
            </div>
            <h3 className="text-xl font-bold text-[#1C1C1C] mb-2 font-serif">Report Sent!</h3>
            <p className="text-sm text-[#5C5C5C]">Thank you for helping keep our library accurate. An admin will review this shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 bg-white flex-1 flex flex-col">
            
            {/* Context Summary */}
            <div className="bg-[#FAF7F0] border border-[#E7E2D6] rounded-xl p-4 mb-6">
              <p className="text-xs font-bold text-[#5C5C5C] uppercase tracking-wider mb-2">Context</p>
              {resource ? (
                <div>
                  <p className="text-sm font-bold text-[#1C1C1C] line-clamp-1">{resource.title}</p>
                  <p className="text-xs text-[#5C5C5C]">{resource.subject} • {resource.academicYear}</p>
                </div>
              ) : (
                <div>
                  <p className="text-sm font-bold text-[#1C1C1C]">Missing Resource</p>
                  <p className="text-xs text-[#5C5C5C]">Subject: {subjectContext?.subject}</p>
                </div>
              )}
            </div>

            <div className="space-y-5 mb-8">
              <div>
                <label className="block text-sm font-bold text-[#1C1C1C] mb-2">Issue Type</label>
                <div className="relative">
                  <select 
                    value={issueType}
                    onChange={(e) => setIssueType(e.target.value)}
                    className="w-full bg-white border border-[#E7E2D6] rounded-xl py-2.5 pl-4 pr-10 text-sm font-medium text-[#1C1C1C] focus:outline-none focus:border-[#1F4D3A]/50 appearance-none shadow-sm cursor-pointer hover:border-[#1F4D3A]/30 transition-colors"
                  >
                    <option value="Broken Link">Broken Download/Preview Link</option>
                    <option value="Wrong File">Incorrect File for this Topic</option>
                    <option value="Missing Resource">Request Missing Resource</option>
                    <option value="Poor Quality">Poor Scan / Unreadable Quality</option>
                    <option value="Other">Other</option>
                  </select>
                  <Icon name="ChevronDown" size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-[#1C1C1C] mb-2">
                  Additional Notes <span className="text-[#5C5C5C] font-normal">(Optional)</span>
                </label>
                <textarea 
                  rows={3}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Provide any helpful details..."
                  className="w-full bg-white border border-[#E7E2D6] rounded-xl py-3 px-4 text-sm text-[#1C1C1C] focus:outline-none focus:border-[#1F4D3A]/50 resize-none shadow-sm"
                />
              </div>
            </div>

            <div className="mt-auto pt-4 flex gap-3">
              <button 
                type="button"
                onClick={onClose}
                className="flex-1 bg-[#FAF7F0] hover:bg-[#EFE7D8] text-[#1F4D3A] border border-[#E7E2D6] py-2.5 rounded-xl font-bold text-sm transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-[#1F4D3A] hover:bg-[#2E6B4F] text-white py-2.5 rounded-xl font-bold text-sm transition-colors disabled:opacity-70 flex items-center justify-center gap-2 shadow-sm"
              >
                {isSubmitting ? (
                  <Icon name="Loader" size={16} className="animate-spin" />
                ) : (
                  <>
                    <Icon name="Send" size={16} />
                    Submit Report
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ReportIssueModal;
