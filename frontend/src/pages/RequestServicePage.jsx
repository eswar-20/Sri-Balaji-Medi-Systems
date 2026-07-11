import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { customerServiceAPI, orderAPI } from '../services/api';
import Loader from '../components/Loader';

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
        resp.data.forEach(order => {
          if (order.items) {
            order.items.forEach(item => {
              products.push({
                id: item.productId,
                name: item.productName || 'Equipment',
                orderDate: order.orderDate || ''
              });
            });
          }
        });
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
      // Ensure date includes time mapping for LocalDateTime
      const scheduledDateTime = formData.scheduledDate + 'T10:00:00';
      const payload = {
        ...formData,
        productId: formData.productId ? Number(formData.productId) : null,
        scheduledDate: scheduledDateTime,
        purchaseDate: formData.purchaseDate || null,
        warrantyExpiry: formData.warrantyExpiry || null
      };

      await customerServiceAPI.createRequest(payload);
      alert('Service request created successfully!');
      navigate('/services/my-requests');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit service request. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader size="large" text="Loading equipment profile..." />;

  return (
    <div className="min-h-screen bg-matte-black py-8">
      <div className="max-w-3xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-beige">Book a Service Request</h1>
          <button onClick={() => navigate('/services/my-requests')} className="btn-secondary">My Requests</button>
        </div>

        {error && (
          <div className="bg-red-950/30 border border-red-900/50 text-red-400 p-4 rounded mb-6 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="card p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Select Purchased Equipment (Optional)</label>
              <select onChange={handleProductSelect} className="input text-beige bg-charcoal">
                <option value="">-- Or Write Details Manually --</option>
                {purchasedProducts.map((p, idx) => (
                  <option key={idx} value={p.id}>{p.name} (Order: {p.orderDate ? p.orderDate.split('T')[0] : ''})</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label">Service Type</label>
              <select name="serviceType" value={formData.serviceType} onChange={handleInputChange} className="input text-beige bg-charcoal" required>
                {SERVICE_TYPES.map(st => (
                  <option key={st.value} value={st.value}>{st.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Equipment Name</label>
              <input type="text" name="equipmentName" value={formData.equipmentName} onChange={handleInputChange} className="input" placeholder="e.g. ECG Machine" required />
            </div>
            <div>
              <label className="label">Equipment Brand</label>
              <input type="text" name="equipmentBrand" value={formData.equipmentBrand} onChange={handleInputChange} className="input" placeholder="e.g. GE Healthcare" required />
            </div>
            <div>
              <label className="label">Equipment Model</label>
              <input type="text" name="equipmentModel" value={formData.equipmentModel} onChange={handleInputChange} className="input" placeholder="e.g. MAC 2000" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="label">Serial Number</label>
              <input type="text" name="serialNumber" value={formData.serialNumber} onChange={handleInputChange} className="input" placeholder="e.g. SN-998822" required />
            </div>
            <div>
              <label className="label">Purchase Date (Optional)</label>
              <input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleInputChange} className="input" />
            </div>
            <div>
              <label className="label">Warranty Expiry (Optional)</label>
              <input type="date" name="warrantyExpiry" value={formData.warrantyExpiry} onChange={handleInputChange} className="input" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Clinic / Hospital Name</label>
              <input type="text" name="clinicHospitalName" value={formData.clinicHospitalName} onChange={handleInputChange} className="input" placeholder="e.g. Care Diagnostics" required />
            </div>
            <div>
              <label className="label">Contact Person Name</label>
              <input type="text" name="contactPerson" value={formData.contactPerson} onChange={handleInputChange} className="input" placeholder="e.g. Dr. Satish Prasad" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Contact Phone</label>
              <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input" placeholder="e.g. 9876543210" required />
            </div>
            <div>
              <label className="label">Priority</label>
              <select name="priority" value={formData.priority} onChange={handleInputChange} className="input text-beige bg-charcoal" required>
                {PRIORITIES.map(p => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="label">Preferred Visit Date</label>
              <input type="date" name="scheduledDate" value={formData.scheduledDate} onChange={handleInputChange} className="input" required />
            </div>
            <div>
              <label className="label">Preferred Time Window</label>
              <select name="preferredVisitTime" value={formData.preferredVisitTime} onChange={handleInputChange} className="input text-beige bg-charcoal" required>
                <option value="Morning 9 AM - 12 PM">Morning 9 AM - 12 PM</option>
                <option value="Afternoon 12 PM - 4 PM">Afternoon 12 PM - 4 PM</option>
                <option value="Evening 4 PM - 7 PM">Evening 4 PM - 7 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Service Address</label>
            <textarea name="address" value={formData.address} onChange={handleInputChange} className="input h-20" placeholder="Full shipping / clinic address in Andhra Pradesh" required />
          </div>

          <div>
            <label className="label">Describe Issue / Request Details</label>
            <textarea name="description" value={formData.description} onChange={handleInputChange} className="input h-32" placeholder="Explain the symptoms or details of calibration needed" required />
          </div>

          <div>
            <label className="label">Attach Image/Photos (Optional - UI Placeholder)</label>
            <input type="file" className="input cursor-pointer py-2 bg-charcoal border-dashed" disabled />
            <span className="text-xs text-light-gray">Upload attachments for diagnostic reference. Only jpeg/png accepted.</span>
          </div>

          <div>
            <label className="label">Customer Remarks (Optional)</label>
            <input type="text" name="customerRemarks" value={formData.customerRemarks} onChange={handleInputChange} className="input" placeholder="Additional instruction details" />
          </div>

          <div className="flex gap-4">
            <button type="submit" className="btn-primary flex-1 py-3" disabled={submitting}>
              {submitting ? 'Submitting Request...' : 'Book Service Visit'}
            </button>
            <button type="button" onClick={() => navigate('/services/my-requests')} className="btn-secondary px-6">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestServicePage;
