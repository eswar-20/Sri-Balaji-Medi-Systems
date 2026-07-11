import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, KeyRound } from 'lucide-react';

const AccessDeniedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#071A2F] flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-[#142F52]/30 border border-white/[0.06] rounded-2xl p-8 text-center shadow-2xl backdrop-blur-md relative">
        
        {/* Shield Icon */}
        <div className="mx-auto w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center border border-red-500/20 mb-6 animate-pulse">
          <ShieldAlert className="w-8 h-8 text-red-500" />
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-1">403: Restriction Active</h1>
        <h2 className="text-xs uppercase font-extrabold text-[#D4AF37] tracking-widest mb-4">Secure Console Access Blocked</h2>
        
        <p className="text-[#C8D3E0] text-xs leading-relaxed mb-8">
          You do not hold the `ROLE_OWNER` credentials required to view this administrative board. If you are an authorized partner, please check your key variables or contact database support.
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
            <KeyRound className="w-4 h-4 text-[#D4AF37]" /> Login Authorized Owner
          </button>
        </div>
      </div>
    </div>
  );
};

export default AccessDeniedPage;
