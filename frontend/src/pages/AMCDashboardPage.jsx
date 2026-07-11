import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerServiceAPI, paymentAPI } from '../services/api';
import Loader from '../components/Loader';
import { Award, ShieldAlert, Sparkles, Plus, BadgeCheck, FileText, ArrowLeft } from 'lucide-react';

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

const AMC_TEMPLATES = [
  { id: 'ecg_basic', name: 'ECG Basic AMC Plan', price: 25000.00, visits: 4, label: 'ECG Basic AMC — ₹25,000 / yr (4 visits)' },
  { id: 'monitor_adv', name: 'Patient Monitor Advanced AMC Plan', price: 45000.00, visits: 6, label: 'Patient Monitor Advanced AMC — ₹45,000 / yr (6 visits)' },
  { id: 'custom', name: 'Custom AMC Contract Plan', price: 75000.00, visits: 8, label: 'Custom ICU Plan — ₹75,000 / yr (8 visits)' }
];

const AMCDashboardPage = () => {
  const navigate = useNavigate();
  const [contracts, setContracts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);

  const [formData, setFormData] = useState({
    equipmentName: '',
    equipmentBrand: '',
    equipmentModel: '',
    serialNumber: '',
    startDate: '',
    endDate: '',
    price: 25000.00,
    visitsPerYear: 4
  });

  const loadContracts = () => {
    setLoading(true);
    customerServiceAPI.getMyContracts()
      .then((resp) => {
        setContracts(resp.data);
        setError('');
      })
      .catch(() => {
        setError('Failed to load active contracts. Please check network logs.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadContracts();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleTemplateChange = (e) => {
    const selectedTemplate = AMC_TEMPLATES.find(t => t.id === e.target.value);
    if (selectedTemplate) {
      setFormData(prev => ({
        ...prev,
        price: selectedTemplate.price,
        visitsPerYear: selectedTemplate.visits,
        equipmentName: selectedTemplate.id !== 'custom' ? selectedTemplate.name : prev.equipmentName
      }));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    let sDate = formData.startDate;
    let eDate = formData.endDate;
    if (!sDate) {
      alert('Please specify a contract start date');
      setSubmitting(false);
      return;
    }
    if (!eDate) {
      const parsedStart = new Date(sDate);
      parsedStart.setFullYear(parsedStart.getFullYear() + 1);
      eDate = parsedStart.toISOString().split('T')[0];
    }

    try {
      const payload = {
        ...formData,
        startDate: sDate,
        endDate: eDate,
        price: Number(formData.price),
        visitsPerYear: Number(formData.visitsPerYear),
        remainingVisits: Number(formData.visitsPerYear)
      };

      const resp = await customerServiceAPI.subscribeAMC(payload);
      const createdContract = resp.data;

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway SDK.');
      }

      const payReq = {
        referenceType: 'AMC_CONTRACT',
        referenceId: createdContract.id,
        amount: createdContract.price,
        currency: 'INR'
      };
      const payResp = await paymentAPI.createOrder(payReq);
      const razorpayOrder = payResp.data;

      const options = {
        key: razorpayOrder.keyId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: "Sri Balaji Medi Systems",
        description: `AMC Subscription Contract #${createdContract.id}`,
        order_id: razorpayOrder.razorpayOrderId,
        handler: async function (response) {
          try {
            setSubmitting(true);
            const verifyReq = {
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
              referenceType: 'AMC_CONTRACT',
              referenceId: createdContract.id
            };
            await paymentAPI.verifyPayment(verifyReq);
            alert('AMC Contract subscription payment verified and contract activated!');
            setShowPurchaseForm(false);
            loadContracts();
          } catch (err) {
            console.error('AMC payment verification failed:', err);
            alert(err.response?.data?.message || 'Payment signature verification failed.');
          } finally {
            setSubmitting(false);
          }
        },
        theme: {
          color: "#D4AF37"
        },
        modal: {
          ondismiss: function() {
            setSubmitting(false);
            alert('AMC contract subscription payment cancelled by user.');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Subscription failed. Please check inputs.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="large" text="Syncing Active AMC Registries..." />;

  return (
    <div className="min-h-screen bg-[#071A2F] text-white py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-10 gap-4 flex-wrap">
          <div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <Award className="w-7 h-7 text-[#D4AF37]" /> AMC Dashboard
            </h1>
            <p className="text-[#C8D3E0] text-sm mt-1">Manage preventative maintenance and service contract files</p>
          </div>
          <button 
            onClick={() => navigate('/services/my-requests')} 
            className="btn-secondary py-2 px-5 text-xs flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" /> Service Pipeline
          </button>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-center text-xs font-semibold flex items-center justify-center gap-2">
            <ShieldAlert className="w-4.5 h-4.5" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Contracts list panel */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#142F52]/30 border border-white/[0.06] rounded-2xl p-6 space-y-6 backdrop-blur">
              <h2 className="text-white font-extrabold text-base tracking-wide uppercase flex items-center gap-2">
                <FileText className="w-4.5 h-4.5 text-[#1D9BF0]" /> Active AMC Agreements ({contracts.length})
              </h2>

              {contracts.length === 0 ? (
                <div className="text-center py-10 bg-[#0F2745]/30 border border-dashed border-white/10 rounded-xl space-y-4">
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-wider">No active Maintenance agreements</p>
                  {!showPurchaseForm && (
                    <button 
                      onClick={() => setShowPurchaseForm(true)} 
                      className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5 mx-auto"
                    >
                      <Plus className="w-4 h-4" /> Subscribe to AMC
                    </button>
                  )}
                </div>
              ) : (
                <div className="space-y-4">
                  {contracts.map((c) => (
                    <div key={c.id} className="bg-[#0F2745]/40 border border-white/10 p-5 rounded-xl hover:border-white/20 transition-all space-y-4">
                      
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h3 className="text-white font-extrabold text-base leading-tight">{c.equipmentName}</h3>
                          <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">{c.equipmentBrand} {c.equipmentModel} (S/N: {c.serialNumber})</p>
                        </div>
                        <span className="text-[9px] px-2.5 py-0.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 font-black uppercase tracking-wider">
                          {c.contractStatus}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-[10px] pt-3 border-t border-white/[0.06] text-slate-400 font-bold uppercase tracking-wider">
                        <div>
                          <span>Duration Range</span>
                          <p className="text-white font-extrabold mt-1 text-xs">{c.startDate} to {c.endDate}</p>
                        </div>
                        <div>
                          <span>Visits Done</span>
                          <p className="text-white font-extrabold mt-1 text-xs">{c.visitsPerYear - c.remainingVisits} / {c.visitsPerYear}</p>
                        </div>
                        <div>
                          <span>Plan Cost</span>
                          <p className="text-[#D4AF37] font-extrabold mt-1 text-xs">{formatPrice(c.price)}</p>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form / Sidebar */}
          <div>
            {!showPurchaseForm ? (
              <div className="bg-[#142F52]/40 border border-white/[0.08] p-6 rounded-2xl space-y-4 shadow-xl text-center">
                <Sparkles className="w-8 h-8 text-[#D4AF37] mx-auto" />
                <h3 className="text-white font-extrabold text-base uppercase tracking-wider text-left border-b border-white/[0.06] pb-2">Preventative Protection</h3>
                <p className="text-[#C8D3E0] text-xs leading-relaxed text-left">
                  Minimize diagnostic machinery failure rates. Subscribing to an AMC plan guarantees scheduled calibration cycles and safety inspections by field engineers.
                </p>
                <button 
                  onClick={() => setShowPurchaseForm(true)} 
                  className="w-full btn-primary py-2.5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5"
                >
                  <Plus className="w-4 h-4" /> Subscribe Plan
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-[#142F52]/30 border border-white/[0.06] p-6 rounded-2xl space-y-4 shadow-xl backdrop-blur">
                <h3 className="text-white font-extrabold text-base tracking-wide uppercase border-b border-white/[0.06] pb-2 flex items-center gap-1.5">
                  <BadgeCheck className="w-4.5 h-4.5 text-emerald-400" /> New AMC Subscription
                </h3>
                
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Choose Machinery Plan</label>
                  <select onChange={handleTemplateChange} className="input-field w-full text-xs">
                    {AMC_TEMPLATES.map(t => (
                      <option key={t.id} value={t.id}>{t.label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Custom Equipment Name</label>
                  <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. ECG Machine" required />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Brand Name</label>
                    <input type="text" name="equipmentBrand" value={formData.equipmentBrand} onChange={handleInputChange} className="input-field w-full text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Model Ref</label>
                    <input type="text" name="equipmentModel" value={formData.equipmentModel} onChange={handleInputChange} className="input-field w-full text-xs" required />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Serial Number (S/N)</label>
                    <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} className="input-field w-full text-xs" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Start Date</label>
                    <input type="date" name="startDate" value={formData.startDate} onChange={handleInputChange} className="input-field w-full text-xs" required />
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button type="submit" className="btn-primary py-2.5 flex-1 text-xs font-bold uppercase" disabled={submitting}>
                    {submitting ? 'Connecting Gateway...' : 'Purchase Subscription'}
                  </button>
                  <button type="button" onClick={() => setShowPurchaseForm(false)} className="btn-secondary py-2.5 px-4 text-xs font-bold uppercase">Cancel</button>
                </div>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default AMCDashboardPage;
