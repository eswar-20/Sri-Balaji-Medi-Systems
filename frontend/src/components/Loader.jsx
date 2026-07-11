import React from 'react';

const Loader = ({ size = 'medium', text = 'Loading...' }) => {
  const sizeClasses = {
    small: 'h-6 w-6 border-2',
    medium: 'h-10 w-10 border-2',
    large: 'h-16 w-16 border-3'
  };

  return (
    <div className="flex flex-col items-center justify-center p-12 w-full text-center">
      <div className={`animate-spin rounded-full border-t-[#D4AF37] border-r-transparent border-b-[#1D9BF0] border-l-transparent ${sizeClasses[size]}`}></div>
      {text && (
        <p className="text-[#C8D3E0] mt-5 text-xs font-bold uppercase tracking-widest animate-pulse">
          {text}
        </p>
      )}
    </div>
  );
};

export default Loader;
