import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { technicianServiceAPI } from '../services/api';
import Loader from '../components/Loader';
import { AlertCircle, Clock, CheckCircle, RefreshCw, ShieldAlert, MapPin, User, Settings, ChevronRight, Wrench } from 'lucide-react';

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
        setJobs(Array.isArray(resp.data) ? resp.data : []);
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
      case 'EMERGENCY': return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-sky-50 text-sky-700 border-sky-200';
    }
  };

  const filteredJobs = getFilteredJobs();

  if (loading) return <Loader size="large" text="Reading Assigned Job Cards..." />;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-sky-700" /> Bio-Engineer Field Portal
            </h1>
            <p className="text-slate-500 text-xs mt-1">Manage assigned hospital visits, diagnosis logs, and equipment calibrations</p>
          </div>
          <button 
            onClick={loadJobs} 
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Jobs
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-slate-200 text-xs font-bold uppercase tracking-wider bg-white rounded-t-xl p-1 shadow-sm">
          {[
            { id: 'today', label: "Today's Jobs", icon: <Clock className="w-4 h-4" /> },
            { id: 'emergency', label: 'Emergency Alerts', icon: <AlertCircle className="w-4 h-4 text-red-600" /> },
            { id: 'upcoming', label: 'All Active Jobs', icon: <Settings className="w-4 h-4" /> },
            { id: 'completed', label: 'Completed Jobs', icon: <CheckCircle className="w-4 h-4 text-emerald-600" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-sky-600 text-white shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-12 text-center text-slate-400 text-xs font-bold uppercase tracking-wider">
            No service jobs assigned for this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((j) => (
              <div 
                key={j.id} 
                className={`bg-white border p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all ${
                  j.priority === 'EMERGENCY' && j.status !== 'COMPLETED' ? 'border-red-300 bg-red-50/20' : 'border-slate-200'
                }`}
                onClick={() => navigate(`/technician/jobs/${j.id}`)}
              >
                <div className="space-y-3">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-sky-700 font-bold uppercase tracking-wider">Ticket ID: #{j.id}</span>
                      <h3 className="text-slate-900 font-extrabold text-base leading-tight">{j.clinicHospitalName}</h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-400" /> {j.contactPerson} – {j.phone}</p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getPriorityBadge(j.priority)}`}>
                      {j.priority}
                    </span>
                  </div>

                  <div className="border-t border-slate-100 pt-3 text-xs text-slate-600 space-y-1.5">
                    <div><span className="text-slate-900 font-bold">Equipment Unit:</span> {j.equipmentName} ({j.equipmentBrand} - {j.equipmentModel})</div>
                    <div className="flex items-start gap-1"><MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" /> <span>{j.address}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400 shrink-0" /> <span>{j.scheduledDate ? j.scheduledDate.replace('T', ' at ') : '—'}</span></div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <span className="text-xs font-bold text-sky-700 flex items-center gap-1">
                      Open Job Card <ChevronRight className="w-3.5 h-3.5" />
                    </span>
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
