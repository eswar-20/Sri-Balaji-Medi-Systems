import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerServiceAPI, paymentAPI } from '../services/api';
import Loader from '../components/Loader';
import { ArrowLeft } from 'lucide-react';

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
      setVisits(Array.isArray(visitResp.data) ? visitResp.data : []);
      setAuditLogs(Array.isArray(auditResp.data) ? auditResp.data : []);

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

  const apiGetInvoice = (reqId) => {
    return customerServiceAPI.getRequestDetails(reqId).then(() => {
      return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/visits`)
        .then(() => {
          return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/assignment`)
            .then(() => {
              return require('../services/api').default.get(`/api/services/customer/requests/${reqId}/invoice`);
            });
        });
    });
  };

  const handlePayInvoice = async () => {
    if (!invoice) return;
    setPaying(true);
    try {
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway SDK. Please check your network.');
      }

      const payReq = {
        referenceType: 'SERVICE_INVOICE',
        referenceId: invoice.id,
        amount: invoice.totalAmount,
        currency: 'INR'
      };
      const payResp = await paymentAPI.createOrder(payReq);
      const razorpayOrder = payResp.data;

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
          color: "#0284C7"
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center max-w-md shadow-sm">
          <p className="text-red-600 text-sm mb-6">{error || 'Request details not found.'}</p>
          <div className="flex gap-4 justify-center">
            <button onClick={loadData} className="btn-primary text-xs py-2 px-5 font-bold">Retry</button>
            <button onClick={() => navigate('/services/my-requests')} className="btn-secondary text-xs py-2 px-5 font-bold">Back to Tracker</button>
          </div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
          <div>
            <span className="text-xs text-sky-700 font-bold uppercase tracking-wider">Service Call / Ref #{request.id}</span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">{request.equipmentName}</h1>
          </div>
          <button onClick={() => navigate('/services/my-requests')} className="btn-secondary text-xs py-2 px-4 font-bold self-start sm:self-auto flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to List
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            
            {/* Timeline Progress */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-900 mb-6">Service Progress</h2>
              <div className="flex justify-between items-center relative">
                {['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'].map((step, idx) => {
                  const statuses = ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED'];
                  const currentIdx = statuses.indexOf(request.status);
                  const isDone = currentIdx >= idx;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1 relative z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isDone ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                        {idx + 1}
                      </div>
                      <span className={`text-[10px] mt-2 uppercase font-bold ${isDone ? 'text-sky-700' : 'text-slate-400'}`}>{step.replace('_', ' ')}</span>
                    </div>
                  );
                })}
                <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200 -z-0" />
              </div>
            </div>

            {/* Visit Details */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Equipment & Clinic Details</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div><span className="text-slate-500 font-medium">Hospital/Clinic:</span> <span className="text-slate-900 font-bold ml-1.5">{request.clinicHospitalName}</span></div>
                <div><span className="text-slate-500 font-medium">Contact Person:</span> <span className="text-slate-900 font-bold ml-1.5">{request.contactPerson}</span></div>
                <div><span className="text-slate-500 font-medium">Contact Phone:</span> <span className="text-sky-700 font-bold ml-1.5">{request.phone}</span></div>
                <div><span className="text-slate-500 font-medium">Service Type:</span> <span className="text-slate-900 font-bold ml-1.5">{request.serviceType}</span></div>
                <div><span className="text-slate-500 font-medium">Brand / Model:</span> <span className="text-slate-900 font-bold ml-1.5">{request.equipmentBrand} - {request.equipmentModel}</span></div>
                <div><span className="text-slate-500 font-medium">Serial Number:</span> <span className="text-slate-900 font-bold ml-1.5">{request.serialNumber || 'N/A'}</span></div>
                <div className="sm:col-span-2"><span className="text-slate-500 font-medium">Clinic Address:</span> <span className="text-slate-900 font-semibold ml-1.5">{request.address}</span></div>
                <div className="sm:col-span-2"><span className="text-slate-500 font-medium">Description:</span> <span className="text-slate-900 font-medium ml-1.5">{request.description}</span></div>
              </div>
            </div>

            {/* Technical Visit History */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-900 mb-4">Technical Visits History ({visits.length})</h2>
              {visits.length === 0 ? (
                <p className="text-xs text-slate-500">No visits have been logged by the technician yet.</p>
              ) : (
                <div className="space-y-4">
                  {visits.map((v) => (
                    <div key={v.id} className="border-l-2 border-sky-600 pl-4 py-1 space-y-1.5">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-900 font-bold">Visit #{v.visitNumber} ({v.purpose})</span>
                        <span className="text-[11px] text-slate-400">{v.visitDate ? new Date(v.visitDate).toLocaleDateString('en-IN') : ''}</span>
                      </div>
                      <p className="text-xs text-slate-600">{v.notes}</p>
                      {v.engineerReportUrl && (
                        <div className="text-xs pt-1">
                          <a href={v.engineerReportUrl} target="_blank" rel="noreferrer" className="text-sky-700 font-bold hover:underline">Download Engineer Report</a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            {/* Engineer Assignment Card */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 text-center space-y-3">
              <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3 text-left">Assigned Field Engineer</h2>
              {assignment ? (
                <div className="space-y-2">
                  <div className="w-14 h-14 bg-sky-50 border border-sky-200 text-sky-700 rounded-full mx-auto flex items-center justify-center font-bold text-lg uppercase">
                    {assignment.engineerName?.charAt(0) || 'E'}
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{assignment.engineerName}</h3>
                  <p className="text-[11px] text-slate-500">Certified Bio-Medical Engineer</p>
                </div>
              ) : (
                <p className="text-xs text-slate-500 py-3">Technician allocation pending review.</p>
              )}
            </div>

            {/* Invoicing Summary */}
            {invoice && (
              <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-4">
                <h2 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">Service Invoice</h2>
                <div className="space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between"><span>Spare Parts Cost:</span><span className="text-slate-900 font-semibold">{formatPrice(invoice.partsCost)}</span></div>
                  <div className="flex justify-between"><span>Labor Fees:</span><span className="text-slate-900 font-semibold">{formatPrice(invoice.laborCost)}</span></div>
                  <div className="flex justify-between"><span>GST Taxes (18%):</span><span className="text-slate-900 font-semibold">{formatPrice(invoice.taxAmount)}</span></div>
                  <div className="flex justify-between text-slate-900 font-bold border-t border-slate-100 pt-2 text-sm">
                    <span>Total Bill:</span>
                    <span className="text-sky-700">{formatPrice(invoice.totalAmount)}</span>
                  </div>
                </div>

                {invoice.invoiceStatus === 'UNPAID' ? (
                  <button onClick={handlePayInvoice} className="btn-primary w-full py-2.5 text-xs font-bold" disabled={paying}>
                    {paying ? 'Processing Payment...' : 'Pay Invoice Online'}
                  </button>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 text-center py-2.5 rounded-xl text-xs font-bold uppercase">
                    Paid Successfully
                  </div>
                )}
              </div>
            )}

            {/* Audit Logs History */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
              <h2 className="text-base font-bold text-slate-900 mb-3 border-b border-slate-100 pb-2">Service Audit Log</h2>
              <div className="space-y-2.5">
                {auditLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="text-xs border-b border-slate-50 pb-2">
                    <div className="flex justify-between items-center text-[10px] text-slate-400 mb-0.5">
                      <span className="font-bold text-slate-600">{log.action}</span>
                      <span>{log.timestamp ? new Date(log.timestamp).toLocaleDateString('en-IN') : ''}</span>
                    </div>
                    <p className="text-slate-700 text-[11px]">{log.notes || 'Status modified'}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Customer Review Widget (unlocks only when request is completed) */}
        {request.status === 'COMPLETED' && (
          <form onSubmit={handleFeedbackSubmit} className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 sm:p-8 mt-8 space-y-5">
            <h2 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">Rate Our Service Visit</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-slate-700 font-semibold text-xs mb-1.5">Rating (1 to 5 Stars)</label>
                <select value={feedback.rating} onChange={(e) => setFeedback(p => ({ ...p, rating: Number(e.target.value) }))} className="input-field w-full text-xs">
                  <option value={5}>⭐⭐⭐⭐⭐ (Excellent)</option>
                  <option value={4}>⭐⭐⭐⭐ (Very Good)</option>
                  <option value={3}>⭐⭐⭐ (Good)</option>
                  <option value={2}>⭐⭐ (Fair)</option>
                  <option value={1}>⭐ (Poor)</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold text-xs mb-1.5">Would you recommend Sri Balaji Medi Systems?</label>
                <select value={feedback.wouldRecommend ? 'yes' : 'no'} onChange={(e) => setFeedback(p => ({ ...p, wouldRecommend: e.target.value === 'yes' }))} className="input-field w-full text-xs">
                  <option value="yes">Yes, definitely</option>
                  <option value="no">No</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1.5">Review / Experience Comments</label>
              <textarea value={feedback.review} onChange={(e) => setFeedback(p => ({ ...p, review: e.target.value }))} className="input-field w-full text-xs h-20 resize-none" placeholder="Comment on technician professionalism, calibration precision, cleanliness..." />
            </div>

            <div>
              <label className="block text-slate-700 font-semibold text-xs mb-1.5">Suggestions for Improvements</label>
              <textarea value={feedback.suggestions} onChange={(e) => setFeedback(p => ({ ...p, suggestions: e.target.value }))} className="input-field w-full text-xs h-20 resize-none" placeholder="Any suggestions to make our hospital support even better..." />
            </div>

            <button type="submit" className="btn-primary py-3 w-full text-xs font-bold" disabled={submittingFeedback}>
              {submittingFeedback ? 'Submitting Review...' : 'Submit Feedback'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ServiceDetailsPage;
