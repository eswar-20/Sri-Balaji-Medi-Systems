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
      case 'EMERGENCY': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      case 'HIGH': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      default: return 'bg-[#252525] text-[#252525] border-[#E5E1DA]';
    }
  };

  const filteredJobs = getFilteredJobs();

  if (loading) return <Loader size="large" text="Reading Assigned Job Cards..." />;

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525] py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight flex items-center gap-2">
              <Wrench className="w-6 h-6 text-[#252525]" /> Bio-Engineer Field Portal
            </h1>
            <p className="text-[#77736E] text-xs mt-1">Manage assigned hospital visits, diagnosis logs, and equipment calibrations</p>
          </div>
          <button 
            onClick={loadJobs} 
            className="btn-secondary py-2 px-4 text-xs flex items-center gap-1.5 font-bold"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Jobs
          </button>
        </div>

        {error && (
          <div className="bg-[#F7F5F0] border border-[#E5E1DA] text-[#55514D] p-4 rounded-xl text-center text-xs font-semibold flex items-center justify-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E1DA] text-xs font-bold uppercase tracking-wider bg-white rounded-t-xl p-1 shadow-sm">
          {[
            { id: 'today', label: "Today's Jobs", icon: <Clock className="w-4 h-4" /> },
            { id: 'emergency', label: 'Emergency Alerts', icon: <AlertCircle className="w-4 h-4 text-[#252525]" /> },
            { id: 'upcoming', label: 'All Active Jobs', icon: <Settings className="w-4 h-4" /> },
            { id: 'completed', label: 'Completed Jobs', icon: <CheckCircle className="w-4 h-4 text-[#252525]" /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 text-center rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                activeTab === tab.id 
                  ? 'bg-[#252525] text-white shadow-sm' 
                  : 'text-[#55514D] hover:text-[#252525] hover:bg-[#FCFBF8]'
              }`}
            >
              {tab.icon}
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Jobs List */}
        {filteredJobs.length === 0 ? (
          <div className="bg-white border border-[#E5E1DA] shadow-sm rounded-2xl p-12 text-center text-[#77736E] text-xs font-bold uppercase tracking-wider">
            No service jobs assigned for this category.
          </div>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((j) => (
              <div 
                key={j.id} 
                className={`bg-white border p-5 rounded-2xl shadow-sm cursor-pointer hover:shadow-md transition-all ${
                  j.priority === 'EMERGENCY' && j.status !== 'COMPLETED' ? 'border-[#55514D] bg-[#F7F5F0]/20' : 'border-[#E5E1DA]'
                }`}
                onClick={() => navigate(`/technician/jobs/${j.id}`)}
              >
                <div className="space-y-3">
                  
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] text-[#252525] font-bold uppercase tracking-wider">Ticket ID: #{j.id}</span>
                      <h3 className="text-[#252525] font-extrabold text-base leading-tight">{j.clinicHospitalName}</h3>
                      <p className="text-xs text-[#55514D] flex items-center gap-1"><User className="w-3.5 h-3.5 text-[#77736E]" /> {j.contactPerson} – {j.phone}</p>
                    </div>
                    <span className={`text-[9px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider border ${getPriorityBadge(j.priority)}`}>
                      {j.priority}
                    </span>
                  </div>

                  <div className="border-t border-[#E5E1DA] pt-3 text-xs text-[#55514D] space-y-1.5">
                    <div><span className="text-[#252525] font-bold">Equipment Unit:</span> {j.equipmentName} ({j.equipmentBrand} - {j.equipmentModel})</div>
                    <div className="flex items-start gap-1"><MapPin className="w-4 h-4 text-[#77736E] shrink-0 mt-0.5" /> <span>{j.address}</span></div>
                    <div className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#77736E] shrink-0" /> <span>{j.scheduledDate ? j.scheduledDate.replace('T', ' at ') : '—'}</span></div>
                  </div>

                  <div className="flex justify-end pt-1">
                    <span className="text-xs font-bold text-[#252525] flex items-center gap-1">
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
