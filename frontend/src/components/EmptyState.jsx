import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  title = 'No items found', 
  description = 'Try adjusting your search or filter criteria',
  icon = null,
  action = null 
}) => {
  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-10 max-w-lg mx-auto text-center space-y-6">
      <div className="flex justify-center">
        {icon || (
          <div className="w-16 h-16 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400">
            <Inbox className="w-8 h-8 text-sky-600" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-slate-900 text-lg font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-slate-500 text-xs leading-relaxed max-w-sm mx-auto">
          {description}
        </p>
      </div>
      {action && (
        <div className="flex justify-center pt-2">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState;
