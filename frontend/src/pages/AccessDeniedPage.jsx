import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white border border-[#E5E1DA] rounded-2xl p-8 text-center shadow-sm relative">
        
        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 bg-[#F7F5F0] rounded-2xl flex items-center justify-center border border-[#E5E1DA] mb-6">
          <ShieldAlert className="w-8 h-8 text-[#252525]" />
        </div>

        <h1 className="text-2xl font-black text-[#252525] tracking-tight mb-1">Access Restricted</h1>
        <h2 className="text-xs uppercase font-extrabold text-[#252525] tracking-widest mb-4">403 Authorization Required</h2>
        
        <p className="text-[#55514D] text-xs leading-relaxed mb-8">
          You do not have the required permissions to view this administrative board. If you are an authorized medical technician or hospital administrator, please sign in with an authorized account.
        </p>

        <div className="space-y-3">
          <button 
            onClick={() => navigate('/')} 
            className="w-full btn-primary py-3 text-xs flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Go to Marketplace
          </button>
          <button 
            onClick={() => navigate('/login')} 
            className="w-full btn-secondary py-3 text-xs flex items-center justify-center gap-1.5"
          >
            <KeyRound className="w-4 h-4 text-[#252525]" /> Sign In with Authorized Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
