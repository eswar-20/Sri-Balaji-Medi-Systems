import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

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
  const [message, setMessage] = useState('');
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
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setMessage('Thank you for contacting us! We will get back to you within 24 hours.');
      setMessageType('success');
      
      // Reset form
      setFormData({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        subject: '',
        message: ''
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-matte-black py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-beige mb-4">Contact Us</h1>
          <p className="text-light-gray text-lg">
            Get in touch with Sri Balaji Medi Systems for all your medical equipment needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-beige mb-6">Business Information</h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-matte-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-beige font-semibold mb-1">Business Name</h3>
                    <p className="text-light-gray">Sri Balaji Medi Systems</p>
                    <p className="text-muted-gold text-sm">Sales & Service of Medical Equipment</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-matte-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-beige font-semibold mb-1">Phone</h3>
                    <p className="text-light-gray">+91 99480 73090</p>
                    <p className="text-muted-gold text-sm">Available 24/7 for emergencies</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-matte-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-beige font-semibold mb-1">Email</h3>
                    <p className="text-light-gray">sribalajimedisystemsofficial@gmail.com</p>
                    <p className="text-muted-gold text-sm">We respond within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-muted-gold rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-matte-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-beige font-semibold mb-1">Address</h3>
                    <p className="text-light-gray">Rajahmundry, Andhra Pradesh</p>
                    <p className="text-muted-gold text-sm">Service available across Andhra Pradesh</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-beige mb-6">Business Hours</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-light-gray">Monday - Saturday</span>
                  <span className="text-muted-gold">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">Sunday</span>
                  <span className="text-muted-gold">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-light-gray">Emergency Service</span>
                  <span className="text-muted-gold">24/7 Available</span>
                </div>
              </div>
            </div>

            <div className="card p-8">
              <h2 className="text-2xl font-semibold text-beige mb-6">Services</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full"></div>
                  <span className="text-light-gray">Medical Equipment Sales</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full"></div>
                  <span className="text-light-gray">Equipment Installation</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full"></div>
                  <span className="text-light-gray">Maintenance & Repair</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full"></div>
                  <span className="text-light-gray">Technical Support</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 bg-muted-gold rounded-full"></div>
                  <span className="text-light-gray">Annual Service Contracts</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-beige mb-6">Send us a Message</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-beige font-medium mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="block text-beige font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email address"
                    className="input-field w-full"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-beige font-medium mb-2">Phone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-beige font-medium mb-2">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  className="input-field w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-beige font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Tell us more about your requirements..."
                  rows="6"
                  className="input-field w-full resize-none"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {loading ? 'Sending Message...' : 'Send Message'}
              </button>
            </form>

            {message && (
              <div className={`mt-6 p-4 rounded-lg text-center ${
                messageType === 'success' 
                  ? 'bg-green-900 text-green-200' 
                  : 'bg-red-900 text-red-200'
              }`}>
                {message}
              </div>
            )}
          </div>
        </div>

        {/* Map Section */}
        <div className="mt-12">
          <div className="card p-8">
            <h2 className="text-2xl font-semibold text-beige mb-6">Location</h2>
            <div className="bg-dark-gray rounded-lg h-64 flex items-center justify-center border border-medium-gray">
              <div className="text-center">
                <svg className="w-16 h-16 text-muted-gold mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-light-gray">Rajahmundry, Andhra Pradesh</p>
                <p className="text-muted-gold text-sm">Service available across Andhra Pradesh</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
