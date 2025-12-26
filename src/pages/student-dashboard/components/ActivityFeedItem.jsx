import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const ActivityFeedItem = ({ activity }) => {
  const getActivityIcon = (type) => {
    const icons = {
      'upload': 'Upload',
      'approval': 'CheckCircle',
      'download': 'Download',
      'collaboration': 'Users'
    };
    return icons?.[type] || 'Bell';
  };

  const getActivityColor = (type) => {
    const colors = {
      'upload': 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400',
      'approval': 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400',
      'download': 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400',
      'collaboration': 'bg-amber-100 dark:bg-amber-900 text-amber-600 dark:text-amber-400'
    };
    return colors?.[type] || 'bg-muted text-muted-foreground';
  };

  const formatTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  return (
    <div className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-lg hover:bg-muted/50 transition-academic">
      <div className={`${getActivityColor(activity?.type)} rounded-lg p-2 flex-shrink-0`}>
        <Icon name={getActivityIcon(activity?.type)} size={16} className="md:w-5 md:h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm text-foreground mb-1 line-clamp-2">
          {activity?.message}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground caption">
          {activity?.userAvatar && (
            <Image 
              src={activity?.userAvatar} 
              alt={activity?.userAvatarAlt}
              className="w-4 h-4 rounded-full object-cover"
            />
          )}
          <span>{formatTime(activity?.timestamp)}</span>
        </div>
      </div>
    </div>
  );
};

export default ActivityFeedItem;