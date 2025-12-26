import React from 'react';
import Icon from '../../../components/AppIcon';

const SubjectSidebar = ({ subjects, activeSubject, onSubjectChange }) => {
  return (
    <div className="hidden xl:block w-64 bg-card border border-border rounded-xl p-4">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <Icon name="BookOpen" size={20} />
        Subjects
      </h3>
      <div className="space-y-1">
        {subjects?.map((subject) => (
          <button
            key={subject?.id}
            onClick={() => onSubjectChange(subject?.name)}
            className={`
              w-full flex items-center justify-between
              px-3 py-2.5 rounded-lg
              text-sm font-medium
              transition-academic
              ${activeSubject === subject?.name
                ? 'bg-primary text-primary-foreground'
                : 'text-foreground hover:bg-muted'
              }
            `}
          >
            <span className="flex items-center gap-2">
              <Icon name={subject?.icon} size={16} />
              {subject?.name}
            </span>
            <div className="flex items-center gap-2">
              {subject?.hasNew && (
                <span className="w-2 h-2 bg-accent rounded-full" />
              )}
              <span className={`
                text-xs px-2 py-0.5 rounded-full
                ${activeSubject === subject?.name
                  ? 'bg-primary-foreground/20 text-primary-foreground'
                  : 'bg-muted text-muted-foreground'
                }
              `}>
                {subject?.count}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SubjectSidebar;