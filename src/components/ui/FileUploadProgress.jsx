import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';

const FileUploadProgress = ({ files = [], onComplete, onError }) => {
  const [uploadProgress, setUploadProgress] = useState({});
  const [uploadStatus, setUploadStatus] = useState({});

  useEffect(() => {
    if (files?.length === 0) return;

    files?.forEach((file) => {
      simulateUpload(file);
    });
  }, [files]);

  const simulateUpload = (file) => {
    const fileId = file?.name + file?.size;
    let progress = 0;

    setUploadStatus(prev => ({
      ...prev,
      [fileId]: 'uploading'
    }));

    const interval = setInterval(() => {
      progress += Math.random() * 15;
      
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        
        const isSuccess = Math.random() > 0.1;
        
        setUploadStatus(prev => ({
          ...prev,
          [fileId]: isSuccess ? 'success' : 'error'
        }));

        if (isSuccess && onComplete) {
          onComplete(file);
        } else if (!isSuccess && onError) {
          onError(file, 'Upload failed. Please try again.');
        }
      }

      setUploadProgress(prev => ({
        ...prev,
        [fileId]: Math.min(progress, 100)
      }));
    }, 300);
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes?.[i];
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return 'CheckCircle';
      case 'error':
        return 'XCircle';
      default:
        return 'Upload';
    }
  };

  const getStatusText = (status, progress) => {
    switch (status) {
      case 'success':
        return 'Upload complete';
      case 'error':
        return 'Upload failed';
      default:
        return `Uploading... ${Math.round(progress)}%`;
    }
  };

  if (files?.length === 0) return null;

  return (
    <div className="file-upload-progress">
      <h3 style={{ 
        fontFamily: 'Crimson Text, serif', 
        fontSize: '1.25rem', 
        fontWeight: '600',
        marginBottom: '16px',
        color: 'var(--color-foreground)'
      }}>
        Uploading Files
      </h3>
      {files?.map((file) => {
        const fileId = file?.name + file?.size;
        let progress = uploadProgress?.[fileId] || 0;
        const status = uploadStatus?.[fileId] || 'uploading';

        return (
          <div key={fileId} className="file-upload-progress-item">
            <div className="file-upload-progress-icon">
              <Icon name={getStatusIcon(status)} size={20} />
            </div>
            <div className="file-upload-progress-info">
              <div className="file-upload-progress-name">{file?.name}</div>
              <div className="file-upload-progress-size">{formatFileSize(file?.size)}</div>
              
              <div className="file-upload-progress-bar">
                <div 
                  className="file-upload-progress-bar-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              
              <div className={`file-upload-progress-status ${status}`}>
                {getStatusText(status, progress)}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default FileUploadProgress;