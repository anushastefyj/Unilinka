import React from 'react';
import Icon from '../../../components/AppIcon';

const ReviewStatisticsCard = ({ statistics }) => {
  const getStatIcon = (type) => {
    switch (type) {
      case 'pending':
        return 'Clock';
      case 'approved':
        return 'CheckCircle';
      case 'rejected':
        return 'XCircle';
      case 'target':
        return 'Target';
      default:
        return 'BarChart3';
    }
  };

  const getStatColor = (type) => {
    switch (type) {
      case 'pending':
        return 'var(--color-warning)';
      case 'approved':
        return 'var(--color-success)';
      case 'rejected':
        return 'var(--color-error)';
      case 'target':
        return 'var(--color-primary)';
      default:
        return 'var(--color-foreground)';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {statistics?.map((stat) => (
        <div
          key={stat?.id}
          className="bg-card border border-border rounded-xl p-4 md:p-6 shadow-academic transition-academic hover:shadow-academic-md"
        >
          <div className="flex items-start justify-between mb-3 md:mb-4">
            <div
              className="w-10 h-10 md:w-12 md:h-12 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: `${getStatColor(stat?.type)}15` }}
            >
              <Icon
                name={getStatIcon(stat?.type)}
                size={20}
                color={getStatColor(stat?.type)}
              />
            </div>
            {stat?.trend && (
              <div
                className={`flex items-center gap-1 px-2 py-1 rounded-md text-xs md:text-sm font-medium ${
                  stat?.trend > 0
                    ? 'bg-success/10 text-success' :'bg-error/10 text-error'
                }`}
              >
                <Icon
                  name={stat?.trend > 0 ? 'TrendingUp' : 'TrendingDown'}
                  size={14}
                />
                <span>{Math.abs(stat?.trend)}%</span>
              </div>
            )}
          </div>
          <div className="space-y-1">
            <p className="text-2xl md:text-3xl font-semibold text-foreground data-text">
              {stat?.value}
            </p>
            <p className="text-sm md:text-base text-muted-foreground">
              {stat?.label}
            </p>
            {stat?.subtitle && (
              <p className="text-xs md:text-sm text-muted-foreground caption">
                {stat?.subtitle}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewStatisticsCard;