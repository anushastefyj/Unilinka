import React from 'react';
import Icon from '../../../components/AppIcon';

const StatsCard = ({ icon, label, value, trend, trendValue }) => {
  // Determine if it's the "purple" highlighted card based on the label, or just keep them all clean
  const isPrimary = label.toLowerCase().includes('download');

  return (
    <div className={`
      relative overflow-hidden border rounded-3xl p-6 transition-all duration-300 hover:-translate-y-1
      ${isPrimary ? 'bg-primary border-primary text-white shadow-lg shadow-primary/30' : 'bg-white border-border text-foreground shadow-sm'}
    `}>
      <div className="flex items-center justify-between mb-4">
        <div className={`p-4 rounded-2xl ${isPrimary ? 'bg-white/20' : 'bg-primary/10'}`}>
          <Icon name={icon} size={28} className={isPrimary ? 'text-white' : 'text-primary'} />
        </div>
      </div>
      
      <div className="space-y-1 relative z-10">
        <p className={`text-4xl font-black ${isPrimary ? 'text-white' : 'text-foreground'}`}>{value}</p>
        <p className={`text-sm font-medium ${isPrimary ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{label}</p>
      </div>

      {/* Decorative Icon Background */}
      <Icon 
        name={icon} 
        size={120} 
        className={`absolute -right-4 -bottom-8 opacity-5 pointer-events-none ${isPrimary ? 'text-white' : 'text-primary'}`} 
      />
    </div>
  );
};

export default StatsCard;