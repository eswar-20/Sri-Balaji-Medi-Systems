import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { technicianServiceAPI } from '../services/api';
import Loader from '../components/Loader';
import { AlertCircle, Clock, CheckCircle, RefreshCw, ShieldAlert, MapPin, User, Settings } from 'lucide-react';

const TechnicianDashboardPage = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('today');

  const loadJobs = () => {
    setLoading(true);
    technicianServiceAPI.getAssignedJobs()
      .then((resp) => {
        setJobs(resp.data);
        setError('');
      })
      .catch(() => {
        setError('Failed to load assigned service jobs. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const getFilteredJobs = () => {
    const todayStr = new Date().toISOString().split('T')[0];
    switch (activeTab) {
      case 'today':
        return jobs.filter(j => j.scheduledDate?.startsWith(todayStr) && j.status !== 'COMPLETED');
      case 'emergency':
        return jobs.filter(j => j.priority === 'EMERGENCY' && j.status !== 'COMPLETED');
      case 'completed':
        return jobs.filter(j => j.status === 'COMPLETED');
      default:
        return jobs.filter(j => j.status !== 'COMPLETED');
    }
  };

  const getPriorityBadge = (p) => {
    switch (p) {
      case 'EMERGENCY': return 'bg-red-500/10 text-red-400 border border-red-500/20';
      case 'HIGH': return 'bg-amber-500/10 text-[#D4AF37] border border-[#D4AF37]/20';
      default: return 'bg-[#142F52] text-slate-300 border border-white/5';
    }
  };

  const filteredJobs = getFilteredJobs();

  if (loading) return <Loader size="large" text="Reading Assigned Job Cards..." />;

  return (
    <div className="min-h-screen bg-[#071A2F] text-white py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Technician Portal</h1>
            <p className="text-[#C8D3E0] text-xs mt-1">Manage field service requests and calibrations</p>
          </div>
          <button 
            onClick={loadJobs} 
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Jobs
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 text-xs font-bold uppercase tracking-wider">
          {[
            { id: 'today', label: "Today's Jobs", icon: <Clock className="w-4 h-4" /> },
            { id: 'emergency', label: 'Emergency Alerts', icon: <AlertCircle className="w-4 h-4" /> },
            { id: 'upcoming', label: 'Upcoming / All Active', icon: <Settings className="w-4 h-4" /> },
            { id: 'completed', label: 'Completed Jobs', icon: <CheckCircle className="w-4 h-4" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 pb-3 text-center border-b-2 transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'border-[#D4AF37] text-[#D4AF37]' 
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-[#142F52]/20 border border-white/[0.06] rounded-2xl p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            No service jobs assigned for this criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((j) => (
              <div 
                key={j.id} 
                className={`bg-[#142F52]/30 border p-5 rounded-2xl cursor-pointer hover:border-[#1D9BF0]/30 transition-all ${
                  j.priority === 'EMERGENCY' && j.status !== 'COMPLETED' ? 'border-red-500/25 bg-red-500/[0.02]' : 'border-white/[0.06]'
                }`}
                onClick={() => navigate(`/technician/jobs/${j.id}`)}
              >
                <div className="space-y-4">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Ticket ID: #{j.id}</span>
                      <h3 className="text-white font-extrabold text-base leading-tight">{j.clinicHospitalName}</h3>
                      <p className="text-xs text-slate-300 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {j.contactPerson} – {j.phone}</p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-lg font-black uppercase tracking-wider ${getPriorityBadge(j.priority)}`}>
                      {j.priority}
                    </span>
                  </div>

                  <div className="border-t border-white/[0.04] pt-3 text-xs text-[#C8D3E0] space-y-1.5">
                    <div><span className="text-white font-bold">Equipment Unit:</span> {j.equipmentName} ({j.equipmentBrand} - {j.equipmentModel})</div>
                    <div className="flex items-start gap-1"><MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> <span>{j.address}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400 shrink-0" /> <span>{j.scheduledDate ? j.scheduledDate.replace('T', ' at ') : '—'}</span></div>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default TechnicianDashboardPage;
