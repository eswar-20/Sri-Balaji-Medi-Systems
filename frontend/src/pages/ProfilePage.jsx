import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Mail, Phone, MapPin } from 'lucide-react';

const ProfilePage = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    authAPI.getProfile()
      .then((resp) => setProfile(resp.data))
      .catch(() => setProfile(user))
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <Loader size="large" text="Loading profile..." />;

  const getRoleBadge = (role) => {
    const roleStr = typeof role === 'object' ? role?.name : role;
    if (roleStr?.includes('OWNER')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200">System Owner</span>;
    }
    if (roleStr?.includes('TECHNICIAN')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">Field Bio-Engineer</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Hospital / Customer</span>;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Medical Profile</h1>
          <p className="text-slate-500 text-sm mt-1">Manage verified hospital contact details and bio-medical service records</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-sky-50 border border-sky-100 text-sky-700 flex items-center justify-center font-black text-xl">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">{profile?.name || 'Authorized Member'}</h2>
              <div className="mt-1">{getRoleBadge(profile?.role)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 text-sky-600" /> Email Address
              </span>
              <p className="text-slate-900 font-medium text-sm truncate">{profile?.email || '—'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-sky-600" /> Phone Number
              </span>
              <p className="text-slate-900 font-medium text-sm">{profile?.phone || '—'}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1 sm:col-span-2">
              <span className="text-slate-400 text-xs flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-sky-600" /> Registered Clinic / Hospital Address
              </span>
              <p className="text-slate-900 font-medium text-sm">{profile?.address || 'Rajahmundry, Andhra Pradesh, India'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
