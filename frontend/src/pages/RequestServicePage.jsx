import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerServiceAPI, orderAPI } from '../services/api';
import Loader from '../components/Loader';
import { AlertCircle, ArrowLeft } from 'lucide-react';

const SERVICE_TYPES = [
  { value: 'INSTALLATION', label: 'Equipment Installation' },
  { value: 'REPAIR', label: 'Equipment Repair' },
  { value: 'PREVENTIVE_MAINTENANCE', label: 'Preventive Maintenance' },
  { value: 'AMC', label: 'Annual Maintenance Contract (AMC)' },
  { value: 'CALIBRATION', label: 'Calibration' },
  { value: 'EMERGENCY_BREAKDOWN', label: 'Emergency Breakdown Service' },
  { value: 'SPARE_REPLACEMENT', label: 'Spare Parts Replacement' },
  { value: 'WARRANTY', label: 'Warranty Service' },
  { value: 'INSPECTION', label: 'Inspection' },
  { value: 'DEINSTALLATION', label: 'Deinstallation' }
];

const PRIORITIES = [
  { value: 'LOW', label: 'Low (Routine check)' },
  { value: 'MEDIUM', label: 'Medium (Standard request)' },
  { value: 'HIGH', label: 'High (Impeding operation)' },
  { value: 'EMERGENCY', label: 'Emergency (Critical failure)' }
];

const RequestServicePage = () => {
  const navigate = useNavigate();
  const [purchasedProducts, setPurchasedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    productId: '',
    equipmentName: '',
    equipmentBrand: '',
    equipmentModel: '',
    serialNumber: '',
    clinicHospitalName: '',
    contactPerson: '',
    phone: '',
    address: '',
    serviceType: 'REPAIR',
    priority: 'MEDIUM',
    description: '',
    scheduledDate: '',
    preferredVisitTime: 'Morning 9 AM - 12 PM',
    purchaseDate: '',
    warrantyExpiry: '',
    customerRemarks: ''
  });

  useEffect(() => {
    // Load customer's purchased products to suggest
    orderAPI.getMyOrders()
      .then((resp) => {
        const products = [];
        if (Array.isArray(resp.data)) {
          resp.data.forEach(order => {
            if (order.items || order.orderItems) {
              const list = order.items || order.orderItems;
              list.forEach(item => {
                products.push({
                  id: item.productId || item.id,
                  name: item.productName || item.name || 'Equipment',
                  orderDate: order.orderDate || order.createdAt || ''
                });
              });
            }
          });
        }
        setPurchasedProducts(products);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleProductSelect = (e) => {
    const pId = e.target.value;
    if (!pId) {
      setFormData(prev => ({
        ...prev,
        productId: '',
        equipmentName: '',
        purchaseDate: ''
      }));
      return;
    }

    const selected = purchasedProducts.find(p => String(p.id) === pId);
    if (selected) {
      setFormData(prev => ({
        ...prev,
        productId: selected.id,
        equipmentName: selected.name,
        purchaseDate: selected.orderDate ? selected.orderDate.split('T')[0] : ''
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const scheduledDateTime = formData.scheduledDate ? formData.scheduledDate + 'T10:00:00' : null;
      const payload = {
        ...formData,
        productId: formData.productId ? Number(formData.productId) : null,
        scheduledDate: scheduledDateTime,
        purchaseDate: formData.purchaseDate || null,
        warrantyExpiry: formData.warrantyExpiry || null
      };

      await customerServiceAPI.createRequest(payload);
      navigate('/services/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service request. Please check required fields.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="large" text="Loading equipment records..." />;

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#252525] tracking-tight">Book Bio-Engineer Visit</h1>
            <p className="text-[#77736E] text-sm mt-1">Schedule certified hospital equipment service, repair, or calibration</p>
          </div>
          <button onClick={() => navigate('/services/my-requests')} className="btn-secondary text-xs py-2 px-4 font-bold flex items-center gap-1.5">
            <ArrowLeft className="w-3.5 h-3.5" /> My Requests
          </button>
        </div>

        {error && (
          <div className="bg-[#F7F5F0] border border-[#E5E1DA] text-[#55514D] p-4 rounded-xl mb-6 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E5E1DA] shadow-sm p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Select Purchased Equipment (Optional)</label>
              <select onChange={handleProductSelect} className="input-field w-full text-xs">
                <option value="">-- Or Write Details Manually --</option>
                {purchasedProducts.map((p, idx) => (
                  <option key={idx} value={p.id}>{p.name} (Order: {p.orderDate ? p.orderDate.split('T')[0] : ''})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Service Type *</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="input-field w-full text-xs" required>
                {SERVICE_TYPES.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Equipment Name *</label>
              <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. ECG Machine" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Equipment Brand *</label>
              <input type="text" name="equipmentBrand" value={formData.equipmentBrand} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. GE Healthcare" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Model Number *</label>
              <input type="text" name="equipmentModel" value={formData.equipmentModel} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. MAC 2000" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Serial Number *</label>
              <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. SN-998822" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Purchase Date (Optional)</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} className="input-field w-full text-xs" />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Warranty Expiry (Optional)</label>
              <input type="date" name="warrantyExpiry" value={formData.warrantyExpiry} onChange={handleInputChange} className="input-field w-full text-xs" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Hospital / Clinic Name *</label>
              <input type="text" name="clinicHospitalName" value={formData.clinicHospitalName} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. Care Diagnostics" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Contact Person Name *</label>
              <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. Dr. Satish Prasad" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Contact Phone *</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field w-full text-xs" placeholder="e.g. 9876543210" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Priority *</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="input-field w-full text-xs" required>
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Preferred Visit Date *</label>
              <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleInputChange} className="input-field w-full text-xs" required />
            </div>
            <div>
              <label className="block text-[#252525] font-semibold text-xs mb-1.5">Preferred Time Window *</label>
              <select name="preferredVisitTime" value={formData.preferredVisitTime} onChange={handleInputChange} className="input-field w-full text-xs" required>
                <option value="Morning 9 AM - 12 PM">Morning 9 AM - 12 PM</option>
                <option value="Afternoon 12 PM - 4 PM">Afternoon 12 PM - 4 PM</option>
                <option value="Evening 4 PM - 7 PM">Evening 4 PM - 7 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[#252525] font-semibold text-xs mb-1.5">Service Location Address *</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} className="input-field w-full text-xs h-20 resize-none" placeholder="Full clinic or lab address in Andhra Pradesh" required />
          </div>

          <div>
            <label className="block text-[#252525] font-semibold text-xs mb-1.5">Describe Issue / Request Details *</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="input-field w-full text-xs h-28 resize-none" placeholder="Explain the symptoms or details of calibration needed..." required />
          </div>

          <div className="flex gap-4 pt-4 border-t border-[#E5E1DA]">
            <button type="submit" className="btn-primary flex-1 py-3 text-xs font-bold" disabled={submitting}>
              {submitting ? 'Submitting Request...' : 'Book Service Visit'}
            </button>
            <button type="button" onClick={() => navigate('/services/my-requests')} className="btn-secondary px-6 text-xs font-bold">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestServicePage;
