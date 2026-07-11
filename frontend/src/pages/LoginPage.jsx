import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, handleApiError } from '../services/api';

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
    <div className="min-h-screen bg-matte-black flex items-center justify-center px-4">
      <div className="max-w-md w-full card p-8">
        <h1 className="text-2xl font-bold text-beige text-center mb-2">Sign in</h1>
        <p className="text-light-gray text-center mb-6 text-sm">Shop medical equipment or access your owner dashboard</p>

        {!showOtpInput ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-beige mb-2">Email or Phone</label>
              <input className="input-field w-full" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="email@example.com or 9948073090" />
            </div>
            {contact.trim().toLowerCase() === 'sribalajimedisystemsofficial@gmail.com' && (
              <div>
                <label className="block text-beige mb-2">Password</label>
                <input type="password" className="input-field w-full text-center" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter admin password" />
              </div>
            )}
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Sending...' : 'Send OTP'}</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <label className="block text-beige mb-2">Your Name</label>
              <input className="input-field w-full" value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
            </div>
            <div>
              <label className="block text-beige mb-2">OTP</label>
              <input className="input-field w-full text-center tracking-widest" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="6-digit OTP" maxLength={6} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">{loading ? 'Verifying...' : 'Verify & Login'}</button>
            <button type="button" onClick={() => setShowOtpInput(false)} className="btn-secondary w-full">Change contact</button>
          </form>
        )}

        {message && (
          <p className={`mt-4 text-sm text-center ${messageType === 'error' ? 'text-red-400' : 'text-green-400'}`}>{message}</p>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
