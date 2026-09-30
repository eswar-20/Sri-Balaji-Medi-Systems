import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, handleApiError } from '../services/api';
import { Shield, KeyRound, User, Mail } from 'lucide-react';

const LoginPage = () => {
  const [contact, setContact] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateContact = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]{10}$/;
    return emailRegex.test(value) || phoneRegex.test(value);
  };

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!contact || !validateContact(contact)) {
      setMessage('Enter a valid email or 10-digit phone number');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      await authAPI.sendOtp(contact, password);
      setShowOtpInput(true);
      setMessage(`OTP sent to ${contact}.`);
      setMessageType('success');
    } catch (error) {
      const apiError = handleApiError(error);
      setMessage(apiError.message);
      setMessageType('error');
      if (apiError.message && apiError.message.includes('For testing, copy this OTP code:')) {
        setShowOtpInput(true);
        const match = apiError.message.match(/copy this OTP code:\s*(\d{6})/);
        if (match && match[1]) {
          setOtp(match[1]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setMessage('Please enter 6-digit OTP');
      setMessageType('error');
      return;
    }
    setLoading(true);
    setMessage('');
    try {
      const resp = await authAPI.verifyOtp(contact, otp, name || 'Customer');
      if (resp.data.success) {
        login(resp.data.user, resp.data.token);
        setMessage('Login successful!');
        setMessageType('success');
        const from = location.state?.from?.pathname;
        const role = resp.data.user?.role?.name || resp.data.user?.role;
        setTimeout(() => {
          if (role === 'OWNER') navigate('/owner/dashboard');
          else navigate(from || '/');
        }, 800);
      } else {
        setMessage(resp.data.message || 'Invalid OTP');
        setMessageType('error');
      }
    } catch (error) {
      setMessage(handleApiError(error).message);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-slate-200 shadow-xl space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white mx-auto shadow-md">
            <Shield className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Sri Balaji Portal</h1>
          <p className="text-slate-500 text-sm">Secure sign in for clients, technicians, and administrators</p>
        </div>

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-2">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Email or Phone</label>
              <div className="relative">
                <input 
                  className="input-field w-full pl-10" 
                  value={contact} 
                  onChange={(e) => setContact(e.target.value)} 
                  placeholder="name@hospital.com or 9948073090" 
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            {contact.trim().toLowerCase() === 'sribalajimedisystemsofficial@gmail.com' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider">Owner Password</label>
                  <button
                    type="button"
                    onClick={() => setPassword('SBMS@2026')}
                    className="text-[11px] text-sky-600 hover:text-sky-700 font-semibold underline"
                  >
                    Use Default (SBMS@2026)
                  </button>
                </div>
                <div className="relative">
                  <input 
                    type="password" 
                    className="input-field w-full pl-10" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    placeholder="Enter owner admin password (default: SBMS@2026)" 
                  />
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Tip: Default is <span className="font-mono font-bold text-slate-700">SBMS@2026</span>. Or use Admin Phone: <button type="button" onClick={() => { setContact('9948073090'); setPassword(''); }} className="text-sky-600 font-bold hover:underline">9948073090</button>
                </p>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm shadow-md flex items-center justify-center space-x-2">
              {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>}
              <span>{loading ? 'Connecting Server & Sending OTP...' : 'Send Verification Code'}</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 pt-2">
            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">Full Name</label>
              <div className="relative">
                <input 
                  className="input-field w-full pl-10" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Dr. Rajesh Kumar" 
                />
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-slate-700 text-xs font-bold uppercase tracking-wider mb-2">6-Digit Verification Code</label>
              <input 
                className="input-field w-full text-center text-lg font-bold tracking-widest text-slate-900" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                placeholder="• • • • • •" 
                maxLength={6} 
              />
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 text-sm shadow-md">
              {loading ? 'Verifying...' : 'Verify & Enter Dashboard'}
            </button>
            
            <button 
              type="button" 
              onClick={() => setShowOtpInput(false)} 
              className="btn-secondary w-full py-2.5 text-xs"
            >
              Change Contact Details
            </button>
          </form>
        )}

        {message && (
          <div className={`p-3.5 rounded-xl text-xs font-medium text-center border ${
            messageType === 'error' 
              ? 'bg-rose-50 text-rose-700 border-rose-200' 
              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
          }`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;

