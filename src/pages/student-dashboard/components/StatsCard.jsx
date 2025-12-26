import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ icon, label, value, trend, trendValue, iconBgColor = 'bg-blue-100 dark:bg-blue-900' }) => {
  return (
    <div className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-academic transition-academic hover:shadow-academic-md">
      <div className="flex items-start justify-between mb-3 md:mb-4">
        <div className={`${iconBgColor} rounded-lg p-2 md:p-3`}>
          <Icon name={icon} size={20} className="text-primary md:w-6 md:h-6" />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs md:text-sm font-medium ${trend === 'up' ? 'text-success' : 'text-error'}`}>
            <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} className="md:w-4 md:h-4" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground data-text">{value}</p>
        <p className="text-xs md:text-sm text-muted-foreground caption">{label}</p>
      </div>
    </div>
  );
};

export default StatsCard;