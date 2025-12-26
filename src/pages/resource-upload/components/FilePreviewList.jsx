import React from 'react';
import Icon from '../../../components/AppIcon';


const FilePreviewList = ({ files, onRemove }) => {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes?.[i];
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'FileText';
      case 'ppt': case'pptx':
        return 'Presentation';
      case 'doc': case'docx':
        return 'FileType';
      default:
        return 'File';
    }
  };

  const getFileColor = (fileName) => {
    const extension = fileName?.split('.')?.pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'var(--color-error)';
      case 'ppt': case'pptx':
        return 'var(--color-warning)';
      case 'doc': case'docx':
        return 'var(--color-primary)';
      default:
        return 'var(--color-muted-foreground)';
    }
  };

  if (files?.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-base md:text-lg font-semibold text-[var(--color-foreground)]">
        Selected Files ({files?.length})
      </h3>
      <div className="space-y-2">
        {files?.map((file, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] transition-all duration-250"
          >
            <div
              className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${getFileColor(file?.name)}15` }}
            >
              <Icon
                name={getFileIcon(file?.name)}
                size={24}
                color={getFileColor(file?.name)}
              />
            </div>

            <div className="flex-1 min-w-0">
              <h4 className="text-sm md:text-base font-medium text-[var(--color-foreground)] truncate">
                {file?.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs md:text-sm text-[var(--color-muted-foreground)] data-text">
                  {formatFileSize(file?.size)}
                </span>
                <span className="text-[var(--color-border)]">•</span>
                <span className="text-xs md:text-sm text-[var(--color-muted-foreground)] uppercase">
                  {file?.name?.split('.')?.pop()}
                </span>
              </div>
            </div>

            <button
              onClick={() => onRemove(index)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--color-muted-foreground)] hover:bg-[var(--color-error)]/10 hover:text-[var(--color-error)] transition-all duration-250 flex-shrink-0"
              aria-label={`Remove ${file?.name}`}
            >
              <Icon name="X" size={18} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FilePreviewList;