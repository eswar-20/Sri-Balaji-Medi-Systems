import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerServiceAPI } from '../services/api';
import Loader from '../components/Loader';

const CustomerServicesPage = () => {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadRequests = () => {
    setLoading(true);
    customerServiceAPI.getMyRequests()
      .then((resp) => {
        setRequests(resp.data);
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
      case 'EMERGENCY': return 'bg-red-950 text-red-400 border border-red-900/30';
      case 'HIGH': return 'bg-orange-950 text-orange-400 border border-orange-900/30';
      case 'MEDIUM': return 'bg-blue-950/30 text-blue-400 border border-blue-900/20';
      default: return 'bg-medium-gray text-light-gray';
    }
  };

  const getStatusColor = (s) => {
    switch (s) {
      case 'COMPLETED': return 'text-green-400 border-green-900/30 bg-green-950/20';
      case 'IN_PROGRESS': return 'text-orange-400 border-orange-900/30 bg-orange-950/20';
      case 'ASSIGNED': return 'text-blue-400 border-blue-900/30 bg-blue-950/20';
      case 'CANCELLED': return 'text-red-400 border-red-900/30 bg-red-950/20';
      default: return 'text-beige border-beige/10 bg-medium-gray/20';
    }
  };

  if (loading) return <Loader size="large" text="Retrieving service requests..." />;

  return (
    <div className="min-h-screen bg-matte-black py-8">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-beige">My Service Requests</h1>
            <p className="text-light-gray text-sm mt-1">Track installations, repairs, and calibration visits</p>
          </div>
          <div className="flex gap-4">
            <button onClick={() => navigate('/services/amc')} className="btn-secondary">AMC Dashboard</button>
            <button onClick={() => navigate('/services/request')} className="btn-primary">Book Request</button>
          </div>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded mb-6 text-center text-sm">
            <p>{error}</p>
            <button onClick={loadRequests} className="text-beige underline mt-2 text-xs font-semibold">Retry</button>
          </div>
        )}

        {requests.length === 0 ? (
          <div className="card p-12 text-center">
            <h2 className="text-xl font-semibold text-beige mb-2">No Service Requests Found</h2>
            <p className="text-light-gray mb-6 max-w-md mx-auto">Need help unboxing, installing, calibrating, or repairing your medical equipment? Book a visit now.</p>
            <button onClick={() => navigate('/services/request')} className="btn-primary">Book First Visit</button>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((r) => (
              <div key={r.id} className="card p-6 hover:border-beige/30 transition-all flex flex-col md:flex-row justify-between gap-6 cursor-pointer" onClick={() => navigate(`/services/requests/${r.id}`)}>
                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs font-mono text-light-gray">ID: #{r.id}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded-full uppercase ${getPriorityColor(r.priority)}`}>{r.priority}</span>
                    <span className={`text-xs px-2.5 py-0.5 rounded border uppercase ${getStatusColor(r.status)}`}>{r.status}</span>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-bold text-beige">{r.equipmentName}</h3>
                    <p className="text-sm text-light-gray">{r.equipmentBrand} - Model {r.equipmentModel} (S/N: {r.serialNumber})</p>
                  </div>

                  <p className="text-sm text-light-gray line-clamp-2">{r.description}</p>
                </div>

                <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-medium-gray pt-4 md:pt-0 md:pl-6 min-w-[200px] text-right space-y-4">
                  <div className="space-y-1 w-full">
                    <div className="text-xs text-light-gray">Scheduled Date:</div>
                    <div className="text-sm text-beige font-semibold">{r.scheduledDate ? r.scheduledDate.split('T')[0] : '—'}</div>
                    <div className="text-xs text-light-gray">{r.preferredVisitTime}</div>
                  </div>

                  <button className="btn-secondary w-full text-xs py-1.5 mt-auto">Track Visit</button>
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
