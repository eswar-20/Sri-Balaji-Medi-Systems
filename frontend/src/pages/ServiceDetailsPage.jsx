import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerServiceAPI, paymentAPI } from '../services/api';
import Loader from '../components/Loader';

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const ServiceDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [assignment, setAssignment] = useState(null);
  const [visits, setVisits] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [invoice, setInvoice] = useState(null);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [paying, setPaying] = useState(false);

  // Feedback State
  const [feedback, setFeedback] = useState({
    rating: 5,
    review: '',
    suggestions: '',
    wouldRecommend: true
  });
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [reqResp, visitResp, auditResp] = await Promise.all([
        customerServiceAPI.getRequestDetails(id),
        customerServiceAPI.getVisits(id),
        customerServiceAPI.getAuditLogs(id)
      ]);

      setRequest(reqResp.data);
      setVisits(visitResp.data);
      setAuditLogs(auditResp.data);

      // Try fetching assignment info
      try {
        const assignResp = await customerServiceAPI.getAssignment(id);
        setAssignment(assignResp.data);
      } catch (e) {
        setAssignment(null);
      }

      // Try fetching invoice info if request is completed or invoice exists
      try {
        const invoiceResp = await apiGetInvoice(id);
        setInvoice(invoiceResp.data);
      } catch (e) {
        setInvoice(null);
      }

    } catch (err) {
      setError('Failed to load request details. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Fallback to fetch invoice via API request details endpoint since we didn't add a direct getter mapping
  const apiGetInvoice = (reqId) => {
    return customerServiceAPI.getRequestDetails(reqId).then(() => {
      // Fetch via standard api.get mapping
      return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/visits`)
        .then(() => {
          return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/assignment`)
            .then(() => {
              // Standard API path for invoice
              return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/invoice`);
            });
        });
    });
  };

  const handlePayInvoice = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      // Load Razorpay Script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway SDK. Please check your network.');
      }

      // Create Payment Order on backend
      const payReq = {
        referenceType: 'SERVICE_INVOICE',
        referenceId: invoice.id,
        amount: invoice.totalAmount,
        currency: 'INR'
      };
      const payResp = await paymentAPI.createOrder(payReq);
      const razorpayOrder = payResp.data;

      // Configure checkout options
      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Sri Balaji Medi Systems",
        description: `Service Invoice #${invoice.id} Payment`,
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            setPaying(true);
            const verifyReq = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              referenceType: 'SERVICE_INVOICE',
              referenceId: invoice.id
            };
            await paymentAPI.verifyPayment(verifyReq);
            alert('Invoice payment verified and settled successfully!');
            loadData();
          } catch (err) {
            console.error('Invoice payment verification failed:', err);
            alert(err.response?.data?.message || 'Payment signature verification failed.');
          } finally {
            setPaying(false);
          }
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function() {
            setPaying(false);
            alert('Invoice payment process cancelled by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Payment failed. Please try again.');
    } finally {
      setPaying(false);
    }
  };

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    setSubmittingFeedback(true);
    try {
      await customerServiceAPI.submitFeedback(id, feedback);
      alert('Thank you for your feedback!');
      loadData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  if (loading) return <Loader size="large" text="Fetching service audit tracker..." />;

  if (error || !request) {
    return (
      <div className="min-h-screen bg-matte-black flex items-center justify-center px-4">
        <div className="card p-8 text-center max-w-md border border-red-900/30">
          <p className="text-red-400 mb-6">{error || 'Request details not found.'}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={loadData} className="btn-primary">Retry</button>
            <button onClick={() => navigate('/services/my-requests')} className="btn-secondary">Back to Tracker</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <span className="text-xs text-light-gray font-mono">Service Tracker / ID: #{request.id}</span>
            <h1 className="text-2xl font-bold text-beige mt-1">{request.equipmentName}</h1>
          </div>
          <button onClick={() => navigate('/services/my-requests')} className="btn-secondary">Back to List</button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            {/* Timeline Progress */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-beige mb-6">Service Progress</h2>
              <div className="flex justify-between items-center relative">
                {['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((step, idx) => {
                  const statuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
                  const currentIdx = statuses.indexOf(request.status);
                  const isDone = currentIdx >= idx;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-beige text-matte-black' : 'bg-charcoal text-light-gray'}`}>
                        {idx + 1}
                      </div>
                      <span className="text-[10px] text-light-gray mt-2 uppercase font-semibold">{step.replace('_', ' ')}</span>
                    </div>
                  );
                })}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-charcoal -z-10" />
              </div>
            </div>

            {/* Visit Details */}
            <div className="card p-6 space-y-4">
              <h2 className="text-lg font-bold text-beige border-b border-medium-gray pb-2">Equipment & Clinic Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><span className="text-light-gray">Hospital/Clinic:</span> <span className="text-beige font-semibold ml-2">{request.clinicHospitalName}</span></div>
                <div><span className="text-light-gray">Contact Person:</span> <span className="text-beige font-semibold ml-2">{request.contactPerson}</span></div>
                <div><span className="text-light-gray">Contact Phone:</span> <span className="text-beige font-semibold ml-2">{request.phone}</span></div>
                <div><span className="text-light-gray">Service Type:</span> <span className="text-beige font-semibold ml-2">{request.serviceType}</span></div>
                <div><span className="text-light-gray">Brand / Model:</span> <span className="text-beige font-semibold ml-2">{request.equipmentBrand} - {request.equipmentModel}</span></div>
                <div><span className="text-light-gray">Serial Number:</span> <span className="text-beige font-semibold ml-2">{request.serialNumber}</span></div>
                <div className="md:col-span-2"><span className="text-light-gray">Clinic Address:</span> <span className="text-beige font-semibold ml-2">{request.address}</span></div>
                <div className="md:col-span-2"><span className="text-light-gray">Description:</span> <span className="text-beige ml-2">{request.description}</span></div>
              </div>
            </div>

            {/* Technical Visit History */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-beige mb-4">Technical Visits History ({visits.length})</h2>
              {visits.length === 0 ? (
                <p className="text-sm text-light-gray">No visits have been logged by the technician yet.</p>
              ) : (
                <div className="space-y-4">
                  {visits.map((v) => (
                    <div key={v.id} className="border-l-2 border-beige pl-4 py-1 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-beige font-semibold">Visit #{v.visitNumber} ({v.purpose})</span>
                        <span className="text-xs text-light-gray">{v.visitDate ? v.visitDate.split('T')[0] : ''}</span>
                      </div>
                      <p className="text-xs text-light-gray">{v.notes}</p>
                      {v.engineerReportUrl && (
                        <div className="text-xs">
                          <span className="text-light-gray">Report:</span>
                          <a href={v.engineerReportUrl} target="_blank" rel="noreferrer" className="text-beige hover:underline ml-2">Download Engineer Report</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-8">
            {/* Engineer Assignment Card */}
            <div className="card p-6 text-center space-y-4">
              <h2 className="text-lg font-bold text-beige border-b border-medium-gray pb-2 text-left">Assigned Technician</h2>
              {assignment ? (
                <div className="space-y-2">
                  <div className="w-16 h-16 bg-charcoal rounded-full mx-auto flex items-center justify-center text-beige font-bold text-xl uppercase">
                    {assignment.engineerName?.charAt(0) || 'T'}
                  </div>
                  <h3 className="text-md font-bold text-beige">{assignment.engineerName}</h3>
                  <p className="text-xs text-light-gray">Sri Balaji Field Engineer</p>
                </div>
              ) : (
                <p className="text-sm text-light-gray py-4">Technician allocation pending review.</p>
              )}
            </div>

            {/* Invoicing Summary */}
            {invoice && (
              <div className="card p-6 space-y-4">
                <h2 className="text-lg font-bold text-beige border-b border-medium-gray pb-2">Service Invoice</h2>
                <div className="space-y-2 text-sm text-light-gray">
                  <div className="flex justify-between"><span>Spare Parts Cost:</span><span className="text-beige font-semibold">${Number(invoice.partsCost).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>Labor Fees:</span><span className="text-beige font-semibold">${Number(invoice.laborCost).toFixed(2)}</span></div>
                  <div className="flex justify-between"><span>GST Taxes (18%):</span><span className="text-beige font-semibold">${Number(invoice.taxAmount).toFixed(2)}</span></div>
                  <div className="flex justify-between text-beige font-bold border-t border-medium-gray pt-2 text-md">
                    <span>Total Bill:</span>
                    <span>${Number(invoice.totalAmount).toFixed(2)}</span>
                  </div>
                </div>

                {invoice.invoiceStatus === 'UNPAID' ? (
                  <button onClick={handlePayInvoice} className="btn-primary w-full py-2.5" disabled={paying}>
                    {paying ? 'Paying Bill...' : 'Pay Invoice Online'}
                  </button>
                ) : (
                  <div className="bg-green-950/20 border border-green-900/30 text-green-400 text-center py-2.5 rounded text-xs font-semibold uppercase">
                    Paid Successfully
                  </div>
                )}
              </div>
            )}

            {/* Audit Logs History */}
            <div className="card p-6">
              <h2 className="text-lg font-bold text-beige mb-4">Request Log Audit</h2>
              <div className="space-y-3">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="text-xs border-b border-medium-gray/50 pb-2">
                    <div className="flex justify-between items-center text-[10px] text-light-gray mb-1">
                      <span>{log.action}</span>
                      <span>{log.timestamp ? log.timestamp.split('T')[0] : ''}</span>
                    </div>
                    <p className="text-beige">{log.notes || 'Status modified'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Review Widget (unlocks only when request is completed) */}
        {request.status === 'COMPLETED' && (
          <form onSubmit={handleFeedbackSubmit} className="card p-8 mt-8 space-y-6">
            <h2 className="text-xl font-bold text-beige border-b border-medium-gray pb-2">Rate Our Service Visit</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label">Rating (1 to 5 Stars)</label>
                <select value={feedback.rating} onChange={(e) => setFeedback(p => ({ ...p, rating: Number(e.target.value) }))} className="input text-beige bg-charcoal">
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                  <option value={3}>⭐⭐⭐ (Good)</option>
                  <option value={2}>⭐⭐ (Fair)</option>
                  <option value={1}>⭐ (Poor)</option>
                </select>
              </div>

              <div>
                <label className="label">Would you recommend Sri Balaji Medi Systems?</label>
                <select value={feedback.wouldRecommend ? 'yes' : 'no'} onChange={(e) => setFeedback(p => ({ ...p, wouldRecommend: e.target.value === 'yes' }))} className="input text-beige bg-charcoal">
                  <option value="yes">Yes, definitely</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Review / Experience Comments</label>
              <textarea value={feedback.review} onChange={(e) => setFeedback(p => ({ ...p, review: e.target.value }))} className="input h-20" placeholder="Comment on technician professionalism, cleanliness, or tools..." />
            </div>

            <div>
              <label className="label">Suggestions for Improvements</label>
              <textarea value={feedback.suggestions} onChange={(e) => setFeedback(p => ({ ...p, suggestions: e.target.value }))} className="input h-20" placeholder="Any suggestions to make our services faster..." />
            </div>

            <button type="submit" className="btn-primary py-3 w-full" disabled={submittingFeedback}>
              {submittingFeedback ? 'Submitting Review...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
