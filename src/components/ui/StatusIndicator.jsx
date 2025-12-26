import React from 'react';
import Icon from '../AppIcon';

const StatusIndicator = ({ status = 'pending', showIcon = true, size = 'default' }) => {
  const statusConfig = {
    pending: {
      label: 'Pending Review',
      icon: 'Clock',
      className: 'pending'
    },
    approved: {
      label: 'Approved',
      icon: 'CheckCircle',
      className: 'approved'
    },
    rejected: {
      label: 'Rejected',
      icon: 'XCircle',
      className: 'rejected'
    }
  };

  const config = statusConfig?.[status] || statusConfig?.pending;
  const sizeClass = size === 'small' ? 'status-indicator-small' : '';

  return (
    <div className={`status-indicator ${config?.className} ${sizeClass}`}>
      {showIcon && (
        <Icon name={config?.icon} size={16} className="status-indicator-icon" />
      )}
      <span>{config?.label}</span>
    </div>
  );
};

export default StatusIndicator;