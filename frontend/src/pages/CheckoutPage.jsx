import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI, paymentAPI } from '../services/api';
import { ShieldCheck, CreditCard, Landmark, User, MapPin } from 'lucide-react';

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

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Payment
  
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: 'Rajahmundry',
    state: 'Andhra Pradesh',
    pincode: '',
    paymentMethod: 'razorpay'
  });

  const [errors, setErrors] = useState({});

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const subtotal = getCartTotal();
  const shipping = subtotal > 50000 ? 0 : 1500;
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + shipping + cgst + sgst;

  const validateForm = () => {
    const newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    if (step === 1) {
      if (!formData.address.trim()) newErrors.address = 'Address is required';
      if (!formData.city.trim()) newErrors.city = 'City is required';
      if (!formData.state.trim()) newErrors.state = 'State is required';
      if (!formData.pincode.trim()) {
        newErrors.pincode = 'Pincode is required';
      } else if (!/^\d{6}$/.test(formData.pincode)) {
        newErrors.pincode = 'Pincode must be 6 digits';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const proceedToPayment = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    setSubmitError(null);

    const orderRequest = {
      customerName: `${formData.firstName} ${formData.lastName}`,
      phone: formData.phone.replace(/\D/g, ''),
      address: formData.address,
      city: formData.city,
      pincode: formData.pincode,
      items: cartItems.map(item => ({
        productId: item.id,
        quantity: item.quantity
      }))
    };

    try {
      const resp = await orderAPI.createOrder(orderRequest);
      const createdOrder = resp.data;

      if (formData.paymentMethod === 'cod') {
        await clearCart();
        navigate('/order-success', { 
          state: { 
            orderData: {
              ...formData,
              items: cartItems,
              total,
              orderNumber: `ME-${createdOrder.id}`,
              paymentMethod: 'cod',
              isCOD: true
            }
          }
        });
      } else {
        const scriptLoaded = await loadRazorpayScript();
        if (!scriptLoaded) {
          throw new Error('Failed to load Razorpay payment SDK.');
        }

        const payOrderReq = {
          referenceType: 'STORE_ORDER',
          referenceId: createdOrder.id,
          amount: total,
          currency: 'INR'
        };
        const payOrderResp = await paymentAPI.createOrder(payOrderReq);
        const razorpayOrder = payOrderResp.data;

        const options = {
          key: razorpayOrder.keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Sri Balaji Medi Systems",
          description: `Machinery Purchase #${createdOrder.id}`,
          order_id: razorpayOrder.razorpayOrderId,
          handler: async function (response) {
            try {
              setIsProcessing(true);
              setSubmitError(null);

              const verificationReq = {
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
                referenceType: 'STORE_ORDER',
                referenceId: createdOrder.id
              };
              await paymentAPI.verifyPayment(verificationReq);

              await clearCart();

              navigate('/order-success', { 
                state: { 
                  orderData: {
                    ...formData,
                    items: cartItems,
                    total,
                    orderNumber: `ME-${createdOrder.id}`,
                    paymentMethod: 'online',
                    isCOD: false
                  }
                }
              });
            } catch (err) {
              console.error('Payment verification failed:', err);
              setSubmitError('Online verification timed out, but your order is preserved. Contact support with reference ID.');
              setIsProcessing(false);
            }
          },
          prefill: {
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#1D9BF0"
          },
          modal: {
            ondismiss: function() {
              setIsProcessing(false);
              setSubmitError('Payment popup closed by user. Order remains pending in checkout.');
            }
          }
        };

        const rzp = new window.Razorpay(options);
        rzp.open();
      }
    } catch (err) {
      console.error('Checkout failed:', err);
      setSubmitError(err.response?.data?.message || 'Error processing purchase. Please check card limits.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <h1 className="text-3xl font-extrabold text-slate-900 mb-8 tracking-tight">Secure Checkout</h1>
        
        {/* Step indicator */}
        <div className="flex items-center gap-4 mb-8 bg-white border border-slate-200 shadow-sm p-4 rounded-xl max-w-xl">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step === 1 ? 'bg-sky-600 text-white' : 'bg-emerald-100 text-emerald-700'}`}>1</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === 1 ? 'text-sky-700' : 'text-slate-500'}`}>Address</span>
          </div>
          <div className="flex-grow h-px bg-slate-200"></div>
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${step === 2 ? 'bg-sky-600 text-white' : 'bg-slate-100 text-slate-400'}`}>2</span>
            <span className={`text-xs font-bold uppercase tracking-wider ${step === 2 ? 'text-sky-700' : 'text-slate-500'}`}>Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Form Columns */}
          <div className="lg:col-span-2 space-y-6">
            
            {step === 1 ? (
              <form onSubmit={proceedToPayment} className="space-y-6">
                
                {/* Step 1: Identity & Address info */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
                  <h2 className="text-slate-900 font-extrabold text-base tracking-wide uppercase flex items-center gap-2">
                    <User className="w-4.5 h-4.5 text-sky-600" /> Primary Contact Info
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      />
                      {errors.firstName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.firstName}</p>}
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      />
                      {errors.lastName && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.lastName}</p>}
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.email}</p>}
                    </div>
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2">Contact Phone *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        placeholder="e.g. 9490123456"
                        className="input-field w-full"
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.phone}</p>}
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
                  <h2 className="text-slate-900 font-extrabold text-base tracking-wide uppercase flex items-center gap-2">
                    <MapPin className="w-4.5 h-4.5 text-teal-600" /> Hospital Delivery Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-slate-700 text-xs font-bold mb-2">Street Address *</label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        className="input-field w-full"
                      />
                      {errors.address && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.address}</p>}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2">City *</label>
                        <input
                          type="text"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          className="input-field w-full"
                        />
                        {errors.city && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.city}</p>}
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2">State *</label>
                        <input
                          type="text"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          className="input-field w-full"
                        />
                        {errors.state && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.state}</p>}
                      </div>
                      <div>
                        <label className="block text-slate-700 text-xs font-bold mb-2">Pincode *</label>
                        <input
                          type="text"
                          name="pincode"
                          value={formData.pincode}
                          onChange={handleInputChange}
                          placeholder="e.g. 533101"
                          className="input-field w-full"
                        />
                        {errors.pincode && <p className="text-red-500 text-[10px] font-bold mt-1">{errors.pincode}</p>}
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-primary py-4 font-bold text-sm"
                >
                  Proceed to Payment Options
                </button>

              </form>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Step 2: Payment choice */}
                <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 space-y-6">
                  <h2 className="text-slate-900 font-extrabold text-base tracking-wide uppercase flex items-center gap-2">
                    <CreditCard className="w-4.5 h-4.5 text-sky-600" /> Payment Gateway Choice
                  </h2>
                  
                  <div className="space-y-4">
                    
                    {/* Razorpay Online */}
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'razorpay' }))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        formData.paymentMethod === 'razorpay' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="razorpay"
                        checked={formData.paymentMethod === 'razorpay'}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-slate-900 font-bold text-sm block">Razorpay Secure Checkout</span>
                        <span className="text-slate-600 text-xs mt-1 block">Pay immediately using UPI (GPay/PhonePe), Credit/Debit Cards, Netbanking, or Wallets.</span>
                      </div>
                    </div>

                    {/* Cash on Delivery */}
                    <div 
                      onClick={() => setFormData(prev => ({ ...prev, paymentMethod: 'cod' }))}
                      className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        formData.paymentMethod === 'cod' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cod"
                        checked={formData.paymentMethod === 'cod'}
                        onChange={handleInputChange}
                        className="mt-1"
                      />
                      <div>
                        <span className="text-slate-900 font-bold text-sm block">Cash on Delivery (COD)</span>
                        <span className="text-slate-600 text-xs mt-1 block">Pay with cash or digital scan-to-pay at your hospital or lab upon freight delivery.</span>
                      </div>
                    </div>

                  </div>
                </div>

                {submitError && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-xl text-red-700 text-xs font-semibold">
                    {submitError}
                  </div>
                )}

                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="btn-secondary py-4 px-6 text-xs font-bold uppercase tracking-wider"
                  >
                    Back to Address
                  </button>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="btn-primary py-4 flex-grow font-bold text-sm"
                  >
                    {isProcessing ? 'Processing Transaction...' : `Confirm Purchase — ${formatPrice(total)}`}
                  </button>
                </div>

              </form>
            )}

          </div>

          {/* Column Right: Sticky Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-slate-200 shadow-sm p-6 rounded-2xl sticky top-24 space-y-6">
              <h2 className="text-slate-900 font-extrabold text-lg tracking-wide uppercase border-b border-slate-100 pb-3">Purchase Summary</h2>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-slate-900 font-semibold">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Transport Delivery</span>
                  <span className="text-emerald-600 font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span className="text-slate-900 font-semibold">{formatPrice(cgst)}</span>
                </div>
                <div className="flex justify-between">
                  <span>SGST (9%)</span>
                  <span className="text-slate-900 font-semibold">{formatPrice(sgst)}</span>
                </div>
                <div className="border-t border-slate-200 pt-4 flex justify-between text-base font-black text-slate-900">
                  <span>Total Amount</span>
                  <span className="text-sky-700">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Items List detail */}
              <div className="border-t border-slate-100 pt-4 space-y-3">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-sky-600" /> Items in Order
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto divide-y divide-slate-100">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-[11px] pt-2 first:pt-0">
                      <span className="text-slate-700 max-w-[70%] truncate">{item.name} x {item.quantity}</span>
                      <span className="text-slate-900 font-bold">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Encrypted indicator */}
              <div className="border-t border-slate-100 pt-4 flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Encrypted SSL Secure</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
