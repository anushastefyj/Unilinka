import React from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../../components/AppIcon';

const SubjectCategoryCard = ({ subject }) => {
  const navigate = useNavigate();

  const handleBrowse = () => {
    navigate('/resource-browse', { state: { selectedSubject: subject?.id } });
  };

  return (
    <div className="bg-primary/5 border border-primary/20 rounded-3xl p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group relative overflow-hidden">
      <div className="flex items-start gap-4 mb-6">
        <div className="bg-primary/20 rounded-2xl p-4 flex-shrink-0 transition-transform group-hover:scale-110">
          <Icon name={subject?.icon} size={28} className="text-primary" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-2 leading-tight">
            {subject?.name}
          </h3>
          <div className="bg-primary/10 inline-flex items-center rounded-full px-3 py-1 mt-1">
            <span className="text-xs font-bold text-primary">
              {typeof subject?.resourceCount === 'number' 
                ? `${subject?.resourceCount} resources` 
                : subject?.resourceCount}
            </span>
          </div>
        </div>
      </div>
      
      <button 
        onClick={handleBrowse}
        className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-sm shadow-primary/30 hover:bg-primary/90 transition-colors"
      >
        View
      </button>

      {/* Decorative background element */}
      <Icon 
        name="PieChart" 
        size={100} 
        className="absolute -right-6 -bottom-6 text-primary opacity-5 pointer-events-none" 
      />
    </div>
  );
};

export default SubjectCategoryCard;