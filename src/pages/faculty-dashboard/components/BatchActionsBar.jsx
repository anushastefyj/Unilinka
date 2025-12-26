import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const BatchActionsBar = ({ selectedCount, onBatchApprove, onBatchReject, onClearSelection }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-2xl px-4">
      <div className="bg-card border-2 border-primary rounded-xl p-4 shadow-academic-xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Icon name="CheckSquare" size={20} color="var(--color-primary)" />
            </div>
            <div>
              <p className="text-base md:text-lg font-semibold text-foreground">
                {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
              </p>
              <p className="text-sm text-muted-foreground caption">
                Choose an action to apply
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="success"
              size="sm"
              iconName="CheckCircle"
              iconPosition="left"
              onClick={onBatchApprove}
              fullWidth
            >
              Approve All
            </Button>
            <Button
              variant="danger"
              size="sm"
              iconName="XCircle"
              iconPosition="left"
              onClick={onBatchReject}
              fullWidth
            >
              Reject All
            </Button>
            <Button
              variant="ghost"
              size="sm"
              iconName="X"
              onClick={onClearSelection}
            >
              Clear
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchActionsBar;