import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import monogramLogo from '../assets/sbms-monogram-color.png';
import { Mail, KeyRound, ArrowLeft, RotateCw, AlertCircle, CheckCircle2 } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('email'); // 'email' | 'otp'
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const shouldReduceMotion = useReducedMotion();

  // Countdown timer for Resend OTP
  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setTimeout(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const validateEmail = (val) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val.trim());
  };

  // User-friendly error sanitizer (prevents exposing internal exceptions, Brevo keys, or stack traces)
  const sanitizeError = (err, action = 'send') => {
    console.error(`[Auth ${action} error]:`, err);

    if (
      err?.code === 'ECONNABORTED' ||
      err?.message?.includes('Network Error') ||
      err?.message?.includes('timeout') ||
      !err?.response
    ) {
      return 'Server connection failed. Please try again.';
    }

    const rawMsg = (
      err?.response?.data?.message ||
      err?.response?.data?.error ||
      err?.message ||
      ''
    ).toLowerCase();

    if (action === 'verify') {
      if (rawMsg.includes('expired') || rawMsg.includes('timeout')) {
        return 'This OTP has expired. Please request a new OTP.';
      }
      if (rawMsg.includes('lockout') || rawMsg.includes('too many')) {
        return 'Too many failed attempts. Please wait a few minutes before trying again.';
      }
      if (rawMsg.includes('invalid') || rawMsg.includes('incorrect') || rawMsg.includes('fail') || rawMsg.includes('mismatch')) {
        return 'Incorrect OTP. Please check your email and try again.';
      }
      return 'Verification failed. Please check the 6-digit code and try again.';
    }

    if (action === 'send') {
      if (rawMsg.includes('lockout') || rawMsg.includes('too many')) {
        return 'Too many requests. Please wait a few minutes before trying again.';
      }
      if (
        rawMsg.includes('brevo') ||
        rawMsg.includes('delivery failed') ||
        rawMsg.includes('mail') ||
        rawMsg.includes('smtp') ||
        rawMsg.includes('fail')
      ) {
        return 'Unable to send OTP right now. Please try again.';
      }
      return 'Unable to send OTP right now. Please try again.';
    }

    return 'An error occurred. Please try again.';
  };

  // STEP 1: Request OTP
  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !validateEmail(cleanEmail)) {
      setError('Please enter a valid email address.');
      setSuccessMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await authAPI.sendOtp(cleanEmail);
      setStep('otp');
      setResendCooldown(60);
      setSuccessMessage(`OTP sent successfully to ${cleanEmail}`);
    } catch (err) {
      setError(sanitizeError(err, 'send'));
    } finally {
      setLoading(false);
    }
  };

  // STEP 2: Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();
    const cleanOtp = otp.trim();

    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the complete 6-digit verification code.');
      setSuccessMessage('');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const response = await authAPI.verifyOtp(cleanEmail, cleanOtp);
      const data = response.data;

      const userRole = data.role ? data.role.toUpperCase() : 'CUSTOMER';
      const userData = {
        name: data.name || (cleanEmail === 'sribalajimedisystemsofficial@gmail.com' ? 'Balaji Admin' : cleanEmail.split('@')[0]),
        email: cleanEmail,
        role: userRole,
        token: data.token,
      };

      login(userData, data.token);

      const redirectFromState = location.state?.from?.pathname;
      if (redirectFromState) {
        navigate(redirectFromState);
      } else if (userRole === 'OWNER') {
        navigate('/owner/dashboard');
      } else if (userRole === 'TECHNICIAN') {
        navigate('/technician/dashboard');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(sanitizeError(err, 'verify'));
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP Action
  const handleResendOtp = async () => {
    if (resendCooldown > 0 || resending) return;

    setResending(true);
    setError('');
    setSuccessMessage('');

    try {
      await authAPI.sendOtp(email.trim());
      setResendCooldown(60);
      setSuccessMessage('A fresh verification code has been sent to your email.');
    } catch (err) {
      setError(sanitizeError(err, 'send'));
    } finally {
      setResending(false);
    }
  };

  const handleChangeEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccessMessage('');
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] flex items-center justify-center px-4 py-12 select-none">
      
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 15, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="max-w-md w-full bg-white p-8 sm:p-10 rounded-3xl border border-[#E5E1DA] shadow-[0_16px_40px_rgba(0,0,0,0.06)] space-y-6"
      >
        
        {/* Brand Header */}
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <img
              src={monogramLogo}
              alt="Sri Balaji Medi Systems Logo"
              className="h-16 w-auto object-contain filter drop-shadow-sm transition-transform duration-300 hover:scale-105"
            />
          </div>
          
          <div>
            <h1 className="text-2xl font-extrabold text-[#252525] tracking-tight">
              Sign In
            </h1>
            <p className="text-[#77736E] text-[11px] font-bold tracking-widest uppercase mt-0.5">
              Sri Balaji Medi Systems
            </p>
          </div>

          <p className="text-[#77736E] text-xs sm:text-sm">
            {step === 'email'
              ? 'Access hospital equipment, order tracking, and healthcare services.'
              : 'Enter the verification code sent to your email.'}
          </p>
        </div>

        {/* STEP 1: Enter Email */}
        {step === 'email' && (
          <form onSubmit={handleSendOtp} className="space-y-4 pt-1">
            <div>
              <label className="block text-[#252525] text-xs font-bold uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  className="input-field w-full pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@hospital.com"
                  autoFocus
                  required
                />
                <Mail className="w-4 h-4 text-[#77736E] absolute left-3.5 top-3" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center space-x-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Sending OTP...' : 'Send OTP'}</span>
            </button>
          </form>
        )}

        {/* STEP 2: Verify OTP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} className="space-y-5 pt-1">
            
            {/* Target Email Banner */}
            <div className="p-3 bg-[#F7F5F0] border border-[#E5E1DA] rounded-2xl flex items-center justify-between text-xs">
              <div className="truncate pr-2">
                <span className="text-[#77736E] block text-[10px] uppercase font-bold tracking-wider">Verifying</span>
                <span className="font-bold text-[#252525] truncate block">{email}</span>
              </div>
              <button
                type="button"
                onClick={handleChangeEmail}
                className="text-[#252525] hover:text-black font-bold text-xs underline shrink-0"
              >
                Change
              </button>
            </div>

            <div>
              <label className="block text-[#252525] text-xs font-bold uppercase tracking-wider mb-2">
                Verification Code
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className="input-field w-full text-center text-2xl font-black tracking-[0.35em] text-[#252525]"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="• • • • • •"
                  maxLength={6}
                  autoFocus
                  required
                />
                <KeyRound className="w-4 h-4 text-[#77736E] absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || otp.length !== 6}
              className="btn-primary w-full py-3.5 text-sm font-bold shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              <span>{loading ? 'Verifying...' : 'Verify OTP'}</span>
            </button>

            {/* Navigation & Resend Actions */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <button
                type="button"
                onClick={handleChangeEmail}
                className="flex items-center gap-1.5 text-[#77736E] hover:text-[#252525] font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Change email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={resendCooldown > 0 || resending}
                className={`flex items-center gap-1.5 font-bold ${
                  resendCooldown > 0 || resending
                    ? 'text-[#77736E] cursor-not-allowed opacity-60'
                    : 'text-[#252525] hover:text-black'
                }`}
              >
                <RotateCw className={`w-3.5 h-3.5 ${resending ? 'animate-spin' : ''}`} />
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>

          </form>
        )}

        {/* Feedback Messages */}
        {error && (
          <div className="p-3.5 rounded-2xl text-xs font-semibold text-center border bg-neutral-100 text-neutral-800 border-neutral-300 flex items-center justify-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-neutral-600" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3.5 rounded-2xl text-xs font-semibold text-center border bg-neutral-100 text-neutral-900 border-neutral-300 flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-neutral-800" />
            <span>{successMessage}</span>
          </div>
        )}

      </motion.div>

    </div>
  );
};

export default LoginPage;
