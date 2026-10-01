import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerServiceAPI } from '../services/api';
import Loader from '../components/Loader';
import { Wrench, Plus, Calendar, ChevronRight, AlertCircle } from 'lucide-react';

const CustomerServicesPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = () => {
    setLoading(true);
    customerServiceAPI.getMyRequests()
      .then((resp) => {
        setRequests(Array.isArray(resp.data) ? resp.data : []);
        setError('');
      })
      .catch((err) => {
        setError('Failed to load service requests. Please try again.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const getPriorityColor = (p) => {
    switch (p) {
      case 'EMERGENCY': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      case 'HIGH': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      case 'MEDIUM': return 'bg-[#252525] text-[#252525] border-[#E5E1DA]';
      default: return 'bg-[#F7F5F0] text-[#252525] border-[#E5E1DA]';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'COMPLETED': return 'bg-[#252525] text-[#252525] border-[#E5E1DA]';
      case 'IN_PROGRESS': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      case 'ASSIGNED': return 'bg-[#252525] text-[#252525] border-[#E5E1DA]';
      case 'CANCELLED': return 'bg-[#F7F5F0] text-[#55514D] border-[#E5E1DA]';
      default: return 'bg-[#F7F5F0] text-[#252525] border-[#E5E1DA]';
    }
  };

  if (loading) return <Loader size="large" text="Retrieving service requests..." />;

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">Bio-Medical Service Visits</h1>
            <p className="text-[#77736E] text-sm mt-1">Track installations, repairs, calibration, and warranty service calls</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button onClick={() => navigate('/services/amc')} className="btn-secondary text-xs py-2.5 px-4 font-bold">
              AMC Contracts
            </button>
            <button onClick={() => navigate('/services/request')} className="btn-primary text-xs py-2.5 px-4 font-bold flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Book Service Call
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-[#F7F5F0] border border-[#E5E1DA] text-[#55514D] p-4 rounded-xl mb-6 text-center text-xs flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </div>
            <button onClick={loadRequests} className="underline font-bold text-[#252525]">Retry</button>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E5E1DA] shadow-sm p-10 text-center space-y-4">
            <div className="w-16 h-16 bg-[#252525] text-[#252525] rounded-2xl flex items-center justify-center mx-auto border border-[#E5E1DA]">
              <Wrench className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-bold text-[#252525]">No Service Requests Found</h2>
            <p className="text-[#77736E] text-xs max-w-md mx-auto">
              Need certified engineers to calibrate, repair, or inspect medical machinery at your hospital? Book an onsite service visit today.
            </p>
            <button onClick={() => navigate('/services/request')} className="btn-primary text-xs py-2.5 px-6 font-bold">
              Book First Engineer Visit
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div 
                key={r.id} 
                className="bg-white rounded-xl border border-[#E5E1DA] shadow-sm hover:shadow-md transition-all p-5 sm:p-6 flex flex-col md:flex-row justify-between gap-6 cursor-pointer" 
                onClick={() => navigate(`/services/requests/${r.id}`)}
              >
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-bold text-[#252525]">SR #{r.id}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${getPriorityColor(r.priority)}`}>
                      {r.priority} Priority
                    </span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase border ${getStatusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </div>
                  
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-[#252525]">{r.equipmentName}</h3>
                    <p className="text-xs text-[#77736E]">{r.equipmentBrand} - Model {r.equipmentModel} (S/N: {r.serialNumber || 'N/A'})</p>
                  </div>

                  <p className="text-xs text-[#55514D] line-clamp-2">{r.description}</p>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end border-t md:border-t-0 md:border-l border-[#E5E1DA] pt-4 md:pt-0 md:pl-6 min-w-[200px] space-y-3">
                  <div className="space-y-1 w-full text-left md:text-right text-xs">
                    <div className="text-[#77736E] font-medium">Scheduled Visit</div>
                    <div className="text-[#252525] font-bold flex items-center md:justify-end gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#252525]" />
                      {r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString('en-IN') : 'Pending Schedule'}
                    </div>
                    {r.preferredVisitTime && <div className="text-[11px] text-[#77736E]">{r.preferredVisitTime}</div>}
                  </div>

                  <button className="btn-secondary w-full text-xs py-2 font-bold flex items-center justify-center gap-1">
                    Track Visit <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerServicesPage;
