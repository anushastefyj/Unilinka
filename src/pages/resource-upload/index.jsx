import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MainNavigation from '../../components/ui/MainNavigation';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import UploadZone from './components/UploadZone';
import FilePreviewList from './components/FilePreviewList';
import MetadataForm from './components/MetadataForm';
import GuidelinesPanel from './components/GuidelinesPanel';
import SubmissionConfirmation from './components/SubmissionConfirmation';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

const ResourceUpload = () => {
  const navigate = useNavigate();
  const { isAuthenticated, userData, currentUser } = useAuth();
  const userRole = userData?.role || 'student';
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    academicYear: '',
    subject: '',
    academicLevel: '',
    tags: []
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [navigate, isAuthenticated]);

  const handleFilesUploaded = (files) => {
    // Convert File objects to a format with IDs
    const filesWithIds = files.map((file, index) => ({
      id: Date.now() + index,
      file: file,
      name: file.name,
      size: file.size,
      type: file.type
    }));
    setUploadedFiles(filesWithIds);
    if (files.length > 0) {
      setCurrentStep(2);
    }
  };

  const handleMetadataChange = (newMetadata) => {
    setMetadata(prev => {
      // If academicYear changes, reset the subject
      if (prev.academicYear !== newMetadata.academicYear) {
        return { ...newMetadata, subject: '' };
      }
      return newMetadata;
    });
  };

  const handleRemoveFile = (index) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (uploadedFiles.length === 0) {
      return;
    }
    
    setIsUploading(true);
    setUploadError(null);

    try {
      for (const fileObj of uploadedFiles) {
        const file = fileObj.file;
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
            title: metadata.title,
            description: metadata.description,
            academic_year: metadata.academicYear,
            subject: metadata.subject,
            uploader_id: currentUser?.id || userData?.id,
            file_url: publicUrl,
            file_type: file.type || fileExt,
            status: 'pending'
          });

        if (dbError) throw dbError;
      }
      
      setIsUploading(false);
      setShowConfirmation(true);
      setCurrentStep(3);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.message || 'An error occurred during upload.');
      setIsUploading(false);
    }
  };

  const handleConfirmSubmission = () => {
    // Reset form after submission
    setUploadedFiles([]);
    setMetadata({
      title: '',
      description: '',
      academicYear: '',
      subject: '',
      academicLevel: '',
      tags: []
    });
    setCurrentStep(1);
    setShowConfirmation(false);
    
    navigate('/student-dashboard');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setCurrentStep(2);
  };

  if (showConfirmation) {
    return (
      <SubmissionConfirmation
        files={uploadedFiles}
        metadata={metadata}
        onConfirm={handleConfirmSubmission}
        onCancel={handleCancel}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Upload Resource - LearnShare Platform</title>
        <meta name="description" content="Upload and share academic resources with the LearnShare community." />
      </Helmet>
      <div className="min-h-screen bg-background">
        <MainNavigation userRole={userRole} isAuthenticated={isAuthenticated} />
        <div className="pt-16 md:pt-20">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-12">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Upload Academic Resource
              </h1>
              <p className="text-base md:text-lg text-muted-foreground">
                Share study materials, notes, or educational content with the community
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Upload Files */}
                {currentStep === 1 && (
                  <div className="bg-card border border-border rounded-xl p-6">
                    <h2 className="text-xl font-semibold text-foreground mb-4">
                      Step 1: Upload Files
                    </h2>
                    <UploadZone 
                      onFilesSelected={handleFilesUploaded}
                      acceptedFormats={['pdf', 'ppt', 'pptx', 'doc', 'docx']}
                      maxFileSize={50 * 1024 * 1024} // 50MB
                    />
                  </div>
                )}

                {/* Step 2: Add Metadata */}
                {currentStep === 2 && (
                  <>
                    <div className="bg-card border border-border rounded-xl p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-foreground">
                          Step 2: Add Resource Information
                        </h2>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconName="ArrowLeft"
                          onClick={() => setCurrentStep(1)}
                        >
                          Back
                        </Button>
                      </div>
                      <MetadataForm
                        formData={metadata}
                        onChange={handleMetadataChange}
                        errors={{}}
                      />
                    </div>

                    <div className="bg-card border border-border rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-foreground mb-4">
                        Uploaded Files
                      </h3>
                      <FilePreviewList
                        files={uploadedFiles}
                        onRemove={handleRemoveFile}
                      />
                    </div>
                    
                    {uploadError && (
                      <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-4">
                        {uploadError}
                      </div>
                    )}

                    <div className="flex justify-end gap-4">
                      <Button
                        variant="outline"
                        disabled={isUploading}
                        onClick={() => {
                          setUploadedFiles([]);
                          setMetadata({
                            title: '',
                            description: '',
                            academicYear: '',
                            subject: '',
                            academicLevel: '',
                            tags: []
                          });
                          setCurrentStep(1);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="primary"
                        iconName="Upload"
                        iconPosition="left"
                        onClick={handleSubmit}
                        disabled={!metadata.title || !metadata.subject || isUploading}
                        loading={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Submit Resource'}
                      </Button>
                    </div>
                  </>
                )}
              </div>

              {/* Guidelines Panel */}
              <div className="lg:col-span-1">
                <GuidelinesPanel />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResourceUpload;
