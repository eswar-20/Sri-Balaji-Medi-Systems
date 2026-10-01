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
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#F7F5F0] text-[#55514D] border border-[#E5E1DA]">System Owner</span>;
    }
    if (roleStr?.includes('TECHNICIAN')) {
      return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#252525] text-[#252525] border border-[#E5E1DA]">Field Bio-Engineer</span>;
    }
    return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#252525] text-[#252525] border border-[#E5E1DA]">Hospital / Customer</span>;
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525] py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">Your Medical Profile</h1>
          <p className="text-[#77736E] text-sm mt-1">Manage verified hospital contact details and bio-medical service records</p>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E1DA] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-[#E5E1DA]">
            <div className="w-16 h-16 rounded-2xl bg-[#252525] border border-[#E5E1DA] text-[#252525] flex items-center justify-center font-black text-xl">
              {profile?.name ? profile.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#252525]">{profile?.name || 'Authorized Member'}</h2>
              <div className="mt-1">{getRoleBadge(profile?.role)}</div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E5E1DA] space-y-1">
              <span className="text-[#77736E] text-xs flex items-center gap-1.5 font-semibold">
                <Mail className="w-3.5 h-3.5 text-[#252525]" /> Email Address
              </span>
              <p className="text-[#252525] font-medium text-sm truncate">{profile?.email || '—'}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E5E1DA] space-y-1">
              <span className="text-[#77736E] text-xs flex items-center gap-1.5 font-semibold">
                <Phone className="w-3.5 h-3.5 text-[#252525]" /> Phone Number
              </span>
              <p className="text-[#252525] font-medium text-sm">{profile?.phone || '—'}</p>
            </div>

            <div className="p-4 rounded-xl bg-[#FCFBF8] border border-[#E5E1DA] space-y-1 sm:col-span-2">
              <span className="text-[#77736E] text-xs flex items-center gap-1.5 font-semibold">
                <MapPin className="w-3.5 h-3.5 text-[#252525]" /> Registered Clinic / Hospital Address
              </span>
              <p className="text-[#252525] font-medium text-sm">{profile?.address || 'Rajahmundry, Andhra Pradesh, India'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
