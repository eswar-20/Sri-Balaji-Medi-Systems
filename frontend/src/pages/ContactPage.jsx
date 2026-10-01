import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Phone, Mail, MapPin, Clock, Send, Headphones } from 'lucide-react';

const ContactPage = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.phone || !formData.subject || !formData.message) {
      setStatusMessage('Please fill in all required fields.');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setStatusMessage('');

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setStatusMessage('Thank you for contacting Sri Balaji Medi Systems! Our clinical engineering desk will reach out within 24 hours.');
      setMessageType('success');
      
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        message: ''
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#FCFBF8] py-12 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#252525] text-[#252525] text-xs font-bold border border-[#E5E1DA] uppercase tracking-wider mb-2">
            <Headphones className="w-3.5 h-3.5" /> 24/7 Clinical Support
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">Contact Sri Balaji Medi Systems</h1>
          <p className="text-[#55514D] text-sm max-w-2xl mx-auto">
            Get in touch with our certified biomedical engineers for machinery inquiries, AMC contracts, or emergency hospital repairs.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <h2 className="text-lg font-bold text-[#252525] border-b border-[#E5E1DA] pb-3">Corporate Headquarters</h2>
              
              <div className="space-y-5 text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#252525] text-[#252525] rounded-xl flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E1DA]">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#252525] font-bold text-sm">Emergency Technical Support</h3>
                    <p className="text-[#55514D] font-semibold">+91 99480 73090</p>
                    <p className="text-[#252525] text-xs mt-0.5 font-medium">Available 24/7 for Critical Hospital Breakdowns</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#252525] text-[#252525] rounded-xl flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E1DA]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#252525] font-bold text-sm">Official Email</h3>
                    <p className="text-[#55514D] text-sm">sribalajimedisystemsofficial@gmail.com</p>
                    <p className="text-[#77736E] text-xs mt-0.5">Response guaranteed within 24 working hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-[#252525] text-[#252525] rounded-xl flex items-center justify-center flex-shrink-0 font-bold border border-[#E5E1DA]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-[#252525] font-bold text-sm">Engineering Workshop & Office</h3>
                    <p className="text-[#55514D]">Rajahmundry, Andhra Pradesh, India</p>
                    <p className="text-[#252525] text-xs mt-0.5 font-medium">Onsite Field Support available statewide across AP & Telangana</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 shadow-sm space-y-4">
              <h2 className="text-base font-bold text-[#252525] flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#252525]" /> Operational Hours
              </h2>
              <div className="space-y-2.5 text-xs text-[#55514D]">
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span>Monday – Saturday</span>
                  <span className="font-semibold text-[#252525]">9:00 AM – 8:00 PM</span>
                </div>
                <div className="flex justify-between py-1 border-b border-[#E5E1DA]">
                  <span>Sunday</span>
                  <span className="font-semibold text-[#252525]">10:00 AM – 6:00 PM</span>
                </div>
                <div className="flex justify-between py-1 text-[#252525] font-bold">
                  <span>Emergency On-Call Hospital Service</span>
                  <span>24/7 Available</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 sm:p-8 shadow-sm">
            <h2 className="text-lg font-bold text-[#252525] mb-6 pb-3 border-b border-[#E5E1DA]">Send an Inquiry</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#252525] font-semibold text-xs mb-1.5">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Doctor / Admin Name"
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[#252525] font-semibold text-xs mb-1.5">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="hospital@domain.com"
                    className="input-field w-full text-xs"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#252525] font-semibold text-xs mb-1.5">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="e.g. 9876543210"
                  className="input-field w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#252525] font-semibold text-xs mb-1.5">Inquiry Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g., Quotation for ECG machine / AMC contract renewal"
                  className="input-field w-full text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-[#252525] font-semibold text-xs mb-1.5">Requirements / Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Describe your equipment specifications or service requirement..."
                  rows="4"
                  className="input-field w-full text-xs resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2"
              >
                {loading ? 'Submitting Inquiry...' : <><Send className="w-4 h-4" /> Send Message</>}
              </button>
            </form>

            {statusMessage && (
              <div className={`mt-4 p-4 rounded-xl text-xs font-medium ${
                messageType === 'success' 
                  ? 'bg-[#252525] text-[#252525] border border-[#E5E1DA]' 
                  : 'bg-[#F7F5F0] text-[#252525] border border-[#E5E1DA]'
              }`}>
                {statusMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
