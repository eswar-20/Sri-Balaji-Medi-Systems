import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { technicianServiceAPI, productAPI } from '../services/api';
import Loader from '../components/Loader';

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
      setVisits(visitResp.data);
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
      alert('Visit started successfully!');
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
        afterPhotoUrl: completionPhotoUrl || 'https://images.unsplash.com/photo-1516549655169-df83a0774514',
        engineerReportUrl: reportUrl || 'https://balajimedi.com/reports/job-summary.pdf',
        status: 'COMPLETED'
      };
      await technicianServiceAPI.completeVisit(visitId, payload);
      alert('Visit completed successfully!');
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
      // Filter products containing search string and are spare parts
      const filtered = resp.data.filter(p => 
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
      alert('Job successfully closed!');
      loadData();
    } catch (err) {
      alert('Failed to complete job request.');
    }
  };

  if (loading) return <Loader size="large" text="Retrieving job assignment details..." />;

  if (error || !job) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md border border-red-900/30">
          <p className="text-red-400 mb-6">{error || 'Job details not found.'}</p>
          <button onClick={() => navigate('/technician/dashboard')} className="btn-secondary">Back to Dashboard</button>
        </div>
      </div>
    );
  }

  // Find if there is any active visit (IN_PROGRESS)
  const activeVisit = visits.find(v => v.status === 'IN_PROGRESS');

  return (
    <div className="min-h-screen bg-matte-black py-6">
      <div className="max-w-4xl mx-auto px-4 space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <span className="text-[10px] text-light-gray font-mono">Technician Portal / ID: #{job.id}</span>
            <h1 className="text-xl font-bold text-beige mt-1">{job.clinicHospitalName}</h1>
          </div>
          <button onClick={() => navigate('/technician/dashboard')} className="btn-secondary text-xs">Dashboard</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            
            {/* Customer Clinic & Machine details */}
            <div className="card p-5 space-y-3">
              <h2 className="text-sm font-bold text-beige border-b border-medium-gray pb-2 uppercase tracking-wide">Client & Asset Info</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-light-gray">
                <div><span className="text-beige font-semibold">Contact Name:</span> {job.contactPerson}</div>
                <div><span className="text-beige font-semibold">Contact Phone:</span> {job.phone}</div>
                <div><span className="text-beige font-semibold">Equipment Asset:</span> {job.equipmentName} ({job.equipmentBrand} - {job.equipmentModel})</div>
                <div><span className="text-beige font-semibold">Serial Number:</span> {job.serialNumber}</div>
                <div><span className="text-beige font-semibold">Scheduled Visit:</span> {job.scheduledDate ? job.scheduledDate.replace('T', ' ') : ''} ({job.preferredVisitTime})</div>
                <div><span className="text-beige font-semibold">Priority level:</span> <span className="text-red-400 font-bold uppercase">{job.priority}</span></div>
                <div className="sm:col-span-2"><span className="text-beige font-semibold">Clinic Address:</span> {job.address}</div>
                <div className="sm:col-span-2"><span className="text-beige font-semibold">Problem reported:</span> {job.description}</div>
              </div>
            </div>

            {/* Visit Management logs */}
            <div className="card p-5 space-y-4">
              <h2 className="text-sm font-bold text-beige border-b border-medium-gray pb-2 uppercase tracking-wide">Job Visit Controls</h2>

              {/* Start Visit form if no active visit in progress */}
              {!activeVisit && job.status !== 'COMPLETED' && (
                <div className="bg-charcoal p-4 rounded space-y-3">
                  <h3 className="text-xs font-bold text-beige">Record/Start Next Visit</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-light-gray block mb-1">Purpose</label>
                      <select value={newVisit.purpose} onChange={(e) => setNewVisit(p => ({ ...p, purpose: e.target.value }))} className="input text-xs bg-matte-black">
                        <option value="Diagnosis">Diagnosis check</option>
                        <option value="Repair">Repair run</option>
                        <option value="Preventive Maintenance">Preventative Check</option>
                        <option value="Calibration">Calibration check</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] text-light-gray block mb-1">Start Date/Time</label>
                      <input type="datetime-local" value={newVisit.visitDate} onChange={(e) => setNewVisit(p => ({ ...p, visitDate: e.target.value }))} className="input text-xs bg-matte-black" />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] text-light-gray block mb-1">Opening Remarks / Visit Notes</label>
                    <input type="text" value={newVisit.notes} onChange={(e) => setNewVisit(p => ({ ...p, notes: e.target.value }))} className="input text-xs bg-matte-black" />
                  </div>
                  <button onClick={handleStartVisit} className="btn-primary w-full py-1.5 text-xs font-semibold" disabled={recordingVisit}>
                    {recordingVisit ? 'Recording Visit...' : 'Start visit now'}
                  </button>
                </div>
              )}

              {/* Complete Active Visit form */}
              {activeVisit && completingVisitId === activeVisit.id && (
                <div className="bg-charcoal p-4 rounded space-y-3">
                  <h3 className="text-xs font-bold text-beige">Complete Active Visit #{activeVisit.visitNumber}</h3>
                  <div>
                    <label className="text-[10px] text-light-gray block mb-1">Notes / Action Report</label>
                    <textarea value={completionNotes} onChange={(e) => setCompletionNotes(e.target.value)} className="input text-xs bg-matte-black h-16" placeholder="Details of repair performed" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-light-gray block mb-1">Completion Photo URL (Optional)</label>
                      <input type="text" value={completionPhotoUrl} onChange={(e) => setCompletionPhotoUrl(e.target.value)} className="input text-xs bg-matte-black" placeholder="https://..." />
                    </div>
                    <div>
                      <label className="text-[10px] text-light-gray block mb-1">Report PDF link (Optional)</label>
                      <input type="text" value={reportUrl} onChange={(e) => setReportUrl(e.target.value)} className="input text-xs bg-matte-black" placeholder="https://..." />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleCompleteVisit(activeVisit.id)} className="btn-primary flex-1 py-1.5 text-xs font-semibold">
                      Complete Visit
                    </button>
                    <button type="button" onClick={() => setCompletingVisitId(null)} className="btn-secondary text-xs px-4">Cancel</button>
                  </div>
                </div>
              )}

              {/* List of Visits */}
              <div className="space-y-3">
                {visits.map(v => (
                  <div key={v.id} className="border border-medium-gray p-3 rounded text-xs space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-beige font-bold">Visit #{v.visitNumber} - {v.purpose}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${v.status === 'COMPLETED' ? 'bg-green-950 text-green-400 border border-green-900/30' : 'bg-orange-950 text-orange-400 border border-orange-900/30'}`}>
                        {v.status}
                      </span>
                    </div>
                    <p className="text-light-gray">{v.notes}</p>
                    
                    {v.status === 'IN_PROGRESS' && completingVisitId !== v.id && (
                      <button onClick={() => setCompletingVisitId(v.id)} className="btn-primary w-full py-1 text-[10px] font-semibold">
                        Complete visit logs
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
              <div className="card p-5 space-y-4">
                <h2 className="text-sm font-bold text-beige border-b border-medium-gray pb-2 uppercase tracking-wide">Spare Parts Dispatch</h2>
                
                {/* Search parts */}
                <div className="space-y-2">
                  <label className="text-[10px] text-light-gray block">Search Spare Parts Catalog</label>
                  <div className="flex gap-2">
                    <input type="text" value={sparePartsSearch} onChange={(e) => setSparePartsSearch(e.target.value)} className="input text-xs" placeholder="e.g. ECG Board" />
                    <button onClick={handleSearchParts} className="btn-secondary text-xs px-3" disabled={searchingParts}>
                      {searchingParts ? '...' : 'Search'}
                    </button>
                  </div>
                </div>

                {catalogProducts.length > 0 && (
                  <div className="bg-charcoal p-2 rounded max-h-40 overflow-y-auto space-y-1.5">
                    {catalogProducts.map(p => (
                      <div 
                        key={p.id} 
                        className={`text-xs p-1.5 rounded cursor-pointer transition-colors ${selectedPart?.id === p.id ? 'bg-beige text-matte-black' : 'hover:bg-matte-black text-beige'}`}
                        onClick={() => setSelectedPart(p)}
                      >
                        {p.name} (${Number(p.price).toFixed(2)}) - Stock: {p.stock}
                      </div>
                    ))}
                  </div>
                )}

                {selectedPart && (
                  <div className="bg-charcoal p-3 rounded space-y-2 text-xs">
                    <div className="font-semibold text-beige">Selected: {selectedPart.name}</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[10px] text-light-gray">Reserve Qty:</span>
                      <input type="number" value={reserveQty} onChange={(e) => setReserveQty(e.target.value)} min={1} max={selectedPart.stock} className="input text-xs w-16 py-1 bg-matte-black" />
                    </div>
                    <button onClick={() => handleReservePart(activeVisit.id)} className="btn-primary w-full py-1 text-xs font-semibold" disabled={reserving}>
                      {reserving ? 'Reserving...' : 'Confirm Reservation'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Complete Job ticket */}
            {job.status !== 'COMPLETED' && (
              <div className="card p-5 text-center space-y-3">
                <h2 className="text-sm font-bold text-beige border-b border-medium-gray pb-2 text-left uppercase tracking-wide">Finish job</h2>
                <p className="text-xs text-light-gray text-left">Click to close this service request ticket when repairs are complete and machines are fully operational.</p>
                <button onClick={handleCompleteJob} className="btn-primary w-full py-2 text-xs font-semibold">
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
