import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-3'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 w-full text-center">
      <div className={`animate-spin rounded-full border-t-sky-600 border-r-transparent border-b-sky-600 border-l-transparent ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-slate-600 mt-4 text-xs font-bold tracking-wide">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
