import React, { useEffect, useState } from 'react';
import Loader from '../components/Loader';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

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

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-beige mb-8">Your Profile</h1>
        <div className="card p-6 space-y-4">
          <div><span className="text-light-gray">Name:</span> <span className="text-beige ml-2">{profile?.name}</span></div>
          <div><span className="text-light-gray">Email:</span> <span className="text-beige ml-2">{profile?.email || '—'}</span></div>
          <div><span className="text-light-gray">Phone:</span> <span className="text-beige ml-2">{profile?.phone || '—'}</span></div>
          <div><span className="text-light-gray">Account type:</span> <span className="text-beige ml-2">{profile?.role?.name || profile?.role || 'Customer'}</span></div>
          <div><span className="text-light-gray">Address:</span> <span className="text-beige ml-2">{profile?.address || 'Rajahmundry, Andhra Pradesh'}</span></div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
