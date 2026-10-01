import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  title = 'No items found', 
  description = 'Try adjusting your search or filter criteria',
  icon = null,
  action = null 
}) => {
  return (
    <div className="bg-[#FCFBF8] border border-[#E5E1DA] rounded-2xl p-10 max-w-lg mx-auto text-center space-y-6">
      <div className="flex justify-center">
        {icon || (
          <div className="w-16 h-16 rounded-2xl bg-white border border-[#E5E1DA] shadow-sm flex items-center justify-center text-[#77736E]">
            <Inbox className="w-8 h-8 text-[#252525]" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-[#252525] text-lg font-bold tracking-tight">
          {title}
        </h3>
        <p className="text-[#77736E] text-xs leading-relaxed max-w-sm mx-auto">
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
