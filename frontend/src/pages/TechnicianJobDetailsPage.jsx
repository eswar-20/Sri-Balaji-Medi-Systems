import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { technicianServiceAPI, productAPI } from '../services/api';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';

const TechnicianJobDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Spare Parts Reservation State
  const [sparePartsSearch, setSparePartsSearch] = useState('');
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [searchingParts, setSearchingParts] = useState(false);
  const [selectedPart, setSelectedPart] = useState(null);
  const [reserveQty, setReserveQty] = useState(1);
  const [reserving, setReserving] = useState(false);

  // New Visit State
  const [recordingVisit, setRecordingVisit] = useState(false);
  const [newVisit, setNewVisit] = useState({
    purpose: 'Diagnosis',
    notes: 'Starting visit to diagnose equipment issues.',
    visitDate: new Date().toISOString().substring(0, 16)
  });

  // Complete Visit State
  const [completingVisitId, setCompletingVisitId] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionPhotoUrl, setCompletionPhotoUrl] = useState('');
  const [reportUrl, setReportUrl] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [jobResp, visitResp] = await Promise.all([
        technicianServiceAPI.getJobDetails(id),
        technicianServiceAPI.getVisits(id)
      ]);
      setJob(jobResp.data);
      setVisits(Array.isArray(visitResp.data) ? visitResp.data : []);
    } catch (err) {
      setError('Failed to retrieve job details. This request may not be assigned to you.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleStartVisit = async () => {
    setRecordingVisit(true);
    try {
      const visitNumber = visits.length + 1;
      const payload = {
        visitNumber,
        purpose: newVisit.purpose,
        notes: newVisit.notes,
        visitDate: newVisit.visitDate + ':00',
        status: 'IN_PROGRESS'
      };
      await technicianServiceAPI.recordVisit(id, payload);
      loadData();
    } catch (err) {
      alert('Failed to start visit.');
    } finally {
      setRecordingVisit(false);
    }
  };

  const handleCompleteVisit = async (visitId) => {
    try {
      const payload = {
        notes: completionNotes || 'Visit completed successfully.',
        afterPhotoUrl: completionPhotoUrl || '',
        engineerReportUrl: reportUrl || '',
        status: 'COMPLETED'
      };
      await technicianServiceAPI.completeVisit(visitId, payload);
      setCompletingVisitId(null);
      setCompletionNotes('');
      setCompletionPhotoUrl('');
      setReportUrl('');
      loadData();
    } catch (err) {
      alert('Failed to complete visit.');
    }
  };

  // Spare parts lookup
  const handleSearchParts = async () => {
    if (!sparePartsSearch) return;
    setSearchingParts(true);
    try {
      const resp = await productAPI.getProducts();
      const filtered = (Array.isArray(resp.data) ? resp.data : []).filter(p => 
        p.name.toLowerCase().includes(sparePartsSearch.toLowerCase()) && 
        (p.productType === 'SPARE_PART' || p.category?.toLowerCase() === 'spare parts')
      );
      setCatalogProducts(filtered);
    } catch (e) {
      alert('Failed to search parts inventory.');
    } finally {
      setSearchingParts(false);
    }
  };

  const handleReservePart = async (visitId) => {
    if (!selectedPart) return;
    setReserving(true);
    try {
      await technicianServiceAPI.reservePart(visitId, selectedPart.id, Number(reserveQty));
      alert('Spare part reserved successfully from inventory!');
      setSelectedPart(null);
      setSparePartsSearch('');
      setCatalogProducts([]);
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to reserve part.');
    } finally {
      setReserving(false);
    }
  };

  const handleCompleteJob = async () => {
    if (!window.confirm('Mark this entire service request as fully completed?')) return;
    try {
      await technicianServiceAPI.completeJob(id);
      loadData();
    } catch (err) {
      alert('Failed to complete job request.');
    }
  };

  if (loading) return <Loader size="large" text="Retrieving job assignment details..." />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <p className="text-red-600 text-sm mb-6">{error || 'Job details not found.'}</p>
          <button onClick={() => navigate('/technician/dashboard')} className="btn-secondary text-xs py-2 px-5 font-bold">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const activeVisit = visits.find(v => v.status === 'IN_PROGRESS');

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Technician Portal / Ticket #{job.id}</span>
            <h1 className="text-2xl font-bold text-slate-900 mt-1">{job.clinicHospitalName}</h1>
          </div>
          <button onClick={() => navigate('/technician/dashboard')} className="btn-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Customer Clinic & Machine details */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">Client & Asset Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600">
                <div><span className="text-slate-900 font-semibold">Contact Person:</span> {job.contactPerson}</div>
                <div><span className="text-slate-900 font-semibold">Phone:</span> {job.phone}</div>
                <div><span className="text-slate-900 font-semibold">Equipment:</span> {job.equipmentName} ({job.equipmentBrand} - {job.equipmentModel})</div>
                <div><span className="text-slate-900 font-semibold">Serial Number:</span> {job.serialNumber}</div>
                <div><span className="text-slate-900 font-semibold">Scheduled Visit:</span> {job.scheduledDate ? job.scheduledDate.replace('T', ' ') : ''} ({job.preferredVisitTime})</div>
                <div><span className="text-slate-900 font-semibold">Priority:</span> <span className="text-red-600 font-bold uppercase">{job.priority}</span></div>
                <div className="sm:col-span-2"><span className="text-slate-900 font-semibold">Clinic Address:</span> {job.address}</div>
                <div className="sm:col-span-2"><span className="text-slate-900 font-semibold">Reported Issue:</span> {job.description}</div>
              </div>
            </div>

            {/* Visit Management logs */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">Job Visit Controls</h2>

              {/* Start Visit form if no active visit in progress */}
              {!activeVisit && job.status !== 'COMPLETED' && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-900">Record / Start Next Visit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1">Purpose</label>
                      <select value={newVisit.purpose} onChange={(e) => setNewVisit(p => ({ ...p, purpose: e.target.value }))} className="input-field w-full text-xs">
                        <option value="Diagnosis">Diagnosis check</option>
                        <option value="Repair">Repair run</option>
                        <option value="Preventive Maintenance">Preventative Check</option>
                        <option value="Calibration">Calibration check</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1">Start Date/Time</label>
                      <input type="datetime-local" value={newVisit.visitDate} onChange={(e) => setNewVisit(p => ({ ...p, visitDate: e.target.value }))} className="input-field w-full text-xs" />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Opening Remarks / Visit Notes</label>
                    <input type="text" value={newVisit.notes} onChange={(e) => setNewVisit(p => ({ ...p, notes: e.target.value }))} className="input-field w-full text-xs" />
                  </div>
                  <button onClick={handleStartVisit} className="btn-primary w-full py-2 text-xs font-bold" disabled={recordingVisit}>
                    {recordingVisit ? 'Recording Visit...' : 'Start Visit Now'}
                  </button>
                </div>
              )}

              {/* Complete Active Visit form */}
              {activeVisit && completingVisitId === activeVisit.id && (
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl space-y-3">
                  <h3 className="text-xs font-bold text-slate-900">Complete Active Visit #{activeVisit.visitNumber}</h3>
                  <div>
                    <label className="text-xs text-slate-600 font-medium block mb-1">Notes / Action Report</label>
                    <textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} className="input-field w-full text-xs h-16 resize-none" placeholder="Details of diagnosis and repair performed..." />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1">Completion Photo URL (Optional)</label>
                      <input type="text" value={completionPhotoUrl} onChange={(e) => setCompletionPhotoUrl(e.target.value)} className="input-field w-full text-xs" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-xs text-slate-600 font-medium block mb-1">Report PDF link (Optional)</label>
                      <input type="text" value={reportUrl} onChange={(e) => setReportUrl(e.target.value)} className="input-field w-full text-xs" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1">
                    <button onClick={() => handleCompleteVisit(activeVisit.id)} className="btn-primary flex-1 py-2 text-xs font-bold">
                      Complete Visit
                    </button>
                    <button type="button" onClick={() => setCompletingVisitId(null)} className="btn-secondary text-xs px-4 font-bold">Cancel</button>
                  </div>
                </div>
              )}

              {/* List of Visits */}
              <div className="space-y-3">
                {visits.map(v => (
                  <div key={v.id} className="border border-slate-200 p-3.5 rounded-xl text-xs space-y-2 bg-white">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-900 font-bold">Visit #{v.visitNumber} - {v.purpose}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-bold ${v.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'}`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-slate-600">{v.notes}</p>
                    
                    {v.status === 'IN_PROGRESS' && completingVisitId !== v.id && (
                      <button onClick={() => setCompletingVisitId(v.id)} className="btn-primary w-full py-1.5 text-xs font-bold mt-2">
                        Complete Visit Logs
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* Spare Parts allocation */}
            {activeVisit && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 uppercase tracking-wide">Spare Parts Dispatch</h2>
                
                {/* Search parts */}
                <div className="space-y-2">
                  <label className="text-xs text-slate-600 font-medium block">Search Spare Parts Catalog</label>
                  <div className="flex gap-2">
                    <input type="text" value={sparePartsSearch} onChange={(e) => setSparePartsSearch(e.target.value)} className="input-field text-xs flex-1" placeholder="e.g. ECG Board" />
                    <button onClick={handleSearchParts} className="btn-secondary text-xs px-3 font-bold" disabled={searchingParts}>
                      {searchingParts ? '...' : 'Search'}
                    </button>
                  </div>
                </div>

                {catalogProducts.length > 0 && (
                  <div className="bg-slate-50 border border-slate-200 p-2 rounded-xl max-h-40 overflow-y-auto space-y-1.5">
                    {catalogProducts.map(p => (
                      <div 
                        key={p.id} 
                        className={`text-xs p-2 rounded-lg cursor-pointer transition-colors ${selectedPart?.id === p.id ? 'bg-sky-600 text-white' : 'hover:bg-slate-200 text-slate-900'}`}
                        onClick={() => setSelectedPart(p)}
                      >
                        {p.name} (₹{Number(p.price).toFixed(2)}) - Stock: {p.stock}
                      </div>
                    ))}
                  </div>
                )}

                {selectedPart && (
                  <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl space-y-2 text-xs">
                    <div className="font-bold text-slate-900">Selected: {selectedPart.name}</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-slate-600">Reserve Qty:</span>
                      <input type="number" value={reserveQty} onChange={(e) => setReserveQty(e.target.value)} min={1} max={selectedPart.stock} className="input-field text-xs w-16 py-1" />
                    </div>
                    <button onClick={() => handleReservePart(activeVisit.id)} className="btn-primary w-full py-1.5 text-xs font-bold" disabled={reserving}>
                      {reserving ? 'Reserving...' : 'Confirm Reservation'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Complete Job ticket */}
            {job.status !== 'COMPLETED' && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center space-y-3">
                <h2 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2 text-left uppercase tracking-wide">Finish Job</h2>
                <p className="text-xs text-slate-500 text-left">Click to close this service request ticket once calibration is verified and customer signoff is complete.</p>
                <button onClick={handleCompleteJob} className="btn-primary w-full py-2.5 text-xs font-bold">
                  Complete Service Ticket
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechnicianJobDetailsPage;
