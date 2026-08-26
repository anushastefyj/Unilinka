import React, { useState } from 'react';
import Icon from './AppIcon';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ACADEMIC_YEARS, BRANCHES, SEMESTERS, HIERARCHICAL_CURRICULUM } from '../../config/curriculum';

const PDFUploadModal = ({ isOpen, onClose, onSuccess, initialContext }) => {
  const { userData, currentUser } = useAuth();
  
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
  // Cascading selections
  const [year, setYear] = useState(initialContext?.year || '');
  const [branch, setBranch] = useState(initialContext?.branch || '');
  const [semester, setSemester] = useState(initialContext?.semester || '');
  const [subject, setSubject] = useState(initialContext?.subject || '');
  
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const getAvailableSubjects = () => {
    if (year && branch && semester) {
      return HIERARCHICAL_CURRICULUM[year]?.[branch]?.[semester] || [];
    }
    return [];
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (selectedFile.type !== 'application/pdf') {
        setError('Please select a PDF file.');
        return;
      }
      if (selectedFile.size > 50 * 1024 * 1024) { // 50MB
        setError('File size must be less than 50MB.');
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.type !== 'application/pdf') {
        setError('Only PDF files are allowed.');
        return;
      }
      setFile(droppedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file || !title || !year || !branch || !semester || !subject) {
      setError('Please fill in all required fields and select a file.');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const userId = currentUser?.id || userData?.id || 'unknown';
      const filePath = `${userId}/${fileName}`;

      // Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('resources')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('resources')
        .getPublicUrl(filePath);

      // Insert into database
      const { error: dbError } = await supabase
        .from('resources')
        .insert({
          title: title,
          description: description,
          academic_year: year,
          branch: branch,
          semester: semester,
          subject: subject,
          uploader_id: userId,
          file_url: publicUrl,
          file_type: 'PDF',
          status: 'pending'
        });

      if (dbError) throw dbError;

      setIsUploading(false);
      
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Upload error:', err);
      setError(err.message || 'An error occurred during upload.');
      setIsUploading(false);
    }
  };

  const inputClass = "w-full bg-[#f4f6f8] text-[#1C1C1C] rounded-xl py-3 px-4 focus:outline-none focus:ring-2 focus:ring-[#1F4D3A]/20 transition-colors placeholder-gray-400 font-medium text-sm border border-[#E7E2D6]";
  const selectClass = `${inputClass} appearance-none cursor-pointer`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
        onClick={isUploading ? undefined : onClose}
      />
      
      <div className="bg-white rounded-[2rem] w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-white/95 backdrop-blur-sm z-20 px-8 py-6 border-b border-[#E7E2D6] flex justify-between items-center rounded-t-[2rem]">
          <div>
            <h2 className="text-2xl font-bold text-[#1C1C1C] font-serif">Upload Resource</h2>
            <p className="text-sm text-[#5C5C5C] mt-1">Uploads go to <span className="font-bold text-amber-600">Pending</span> until approved.</p>
          </div>
          <button 
            onClick={onClose}
            disabled={isUploading}
            className="w-10 h-10 rounded-full bg-[#EFE7D8] flex items-center justify-center text-[#1F4D3A] hover:bg-[#1F4D3A] hover:text-white transition-colors disabled:opacity-50"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {/* File Dropzone */}
          <div>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-3xl p-8 text-center transition-colors ${
                file ? 'border-[#1F4D3A] bg-[#1F4D3A]/5' : 'border-[#E7E2D6] hover:border-[#1F4D3A]/50 bg-[#FAF7F0]'
              }`}
            >
              <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mx-auto mb-4 text-[#1F4D3A]">
                <Icon name={file ? "FileText" : "UploadCloud"} size={32} />
              </div>
              
              {file ? (
                <div>
                  <p className="text-base font-bold text-[#1C1C1C] mb-1">{file.name}</p>
                  <p className="text-sm text-[#5C5C5C]">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  <button 
                    type="button" 
                    onClick={() => setFile(null)}
                    className="text-red-500 text-sm font-medium mt-3 hover:underline"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-base font-bold text-[#1C1C1C] mb-1">Drag & Drop your PDF here</h3>
                  <p className="text-sm text-[#5C5C5C] mb-4">Maximum file size 50MB</p>
                  <label className="cursor-pointer bg-[#1F4D3A] text-white px-6 py-2.5 rounded-full font-medium text-sm hover:bg-[#2E6B4F] transition-colors inline-block">
                    Browse File
                    <input 
                      type="file" 
                      accept=".pdf,application/pdf" 
                      className="hidden" 
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Year */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Year *</label>
              <select 
                value={year} 
                onChange={(e) => { setYear(e.target.value); setSubject(''); }}
                className={selectClass}
              >
                <option value="" disabled>Select Year</option>
                {ACADEMIC_YEARS.filter(y => y.id !== 'all').map(y => (
                  <option key={y.id} value={y.value}>{y.label}</option>
                ))}
              </select>
              <Icon name="ChevronDown" size={16} className="absolute right-4 bottom-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Branch */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Branch *</label>
              <select 
                value={branch} 
                onChange={(e) => { setBranch(e.target.value); setSubject(''); }}
                className={selectClass}
              >
                <option value="" disabled>Select Branch</option>
                {BRANCHES.map(b => (
                  <option key={b.id} value={b.value}>{b.label}</option>
                ))}
              </select>
              <Icon name="ChevronDown" size={16} className="absolute right-4 bottom-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Semester */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Semester *</label>
              <select 
                value={semester} 
                onChange={(e) => { setSemester(e.target.value); setSubject(''); }}
                className={selectClass}
              >
                <option value="" disabled>Select Semester</option>
                {SEMESTERS.map(s => (
                  <option key={s.id} value={s.value}>{s.label}</option>
                ))}
              </select>
              <Icon name="ChevronDown" size={16} className="absolute right-4 bottom-3.5 text-gray-400 pointer-events-none" />
            </div>

            {/* Subject */}
            <div className="relative">
              <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Subject *</label>
              <select 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)}
                className={selectClass}
                disabled={!year || !branch || !semester}
              >
                <option value="" disabled>Select Subject</option>
                {getAvailableSubjects().map(subj => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              <Icon name="ChevronDown" size={16} className="absolute right-4 bottom-3.5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Title *</label>
            <input 
              type="text" 
              placeholder="E.g., Midterm Review Notes"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#5C5C5C] mb-1.5 uppercase tracking-wide">Description (Optional)</label>
            <textarea 
              placeholder="Add any helpful details about this file..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputClass} resize-none min-h-[100px]`}
            />
          </div>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 text-sm font-medium rounded-xl border border-red-100">
              {error}
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 flex items-center justify-end gap-4 border-t border-[#E7E2D6]">
            <button 
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-6 py-3 rounded-full text-sm font-bold text-[#5C5C5C] hover:bg-[#EFE7D8] transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit"
              disabled={isUploading || !file || !title || !subject}
              className="bg-[#1F4D3A] text-white px-8 py-3 rounded-full font-bold text-sm hover:bg-[#2E6B4F] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-sm"
            >
              {isUploading ? (
                <>
                  <Icon name="Loader" size={18} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                'Upload Resource'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default PDFUploadModal;
