import React from 'react';
import { Inbox } from 'lucide-react';

const EmptyState = ({ 
  title = 'No items found', 
  description = 'Try adjusting your search or filter criteria',
  icon = null,
  action = null 
}) => {
  return (
    <div className="bg-[#142F52]/20 border border-white/[0.06] rounded-3xl p-10 max-w-lg mx-auto text-center space-y-6 shadow-xl backdrop-blur-lg">
      <div className="flex justify-center">
        {icon || (
          <div className="w-16 h-16 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-slate-400">
            <Inbox className="w-8 h-8" />
          </div>
        )}
      </div>
      <div className="space-y-2">
        <h3 className="text-white text-lg font-black tracking-tight">
          {title}
        </h3>
        <p className="text-[#C8D3E0] text-xs leading-relaxed max-w-sm mx-auto">
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
