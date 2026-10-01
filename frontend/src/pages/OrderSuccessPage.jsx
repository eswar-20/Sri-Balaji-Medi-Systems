import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Printer, ShoppingBag } from 'lucide-react';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderData = location.state?.orderData;

  useEffect(() => {
    if (!orderData) {
      navigate('/');
    }
  }, [orderData, navigate]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (!orderData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525] py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Success Header */}
        <div className="text-center mb-10 space-y-4">
          <div className="w-20 h-20 bg-[#252525] border border-[#E5E1DA] rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-10 h-10 text-[#252525]" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] tracking-tight">Order Confirmed!</h1>
          <p className="text-[#55514D] text-sm max-w-lg mx-auto leading-relaxed">
            Thank you for your purchase, <strong className="text-[#252525]">{orderData.firstName} {orderData.lastName}</strong>! Your medical equipment dispatch is now scheduled in our queue.
          </p>
        </div>

        {/* Invoice Summary Card */}
        <div className="bg-white border border-[#E5E1DA] shadow-sm rounded-2xl p-6 mb-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 divide-y md:divide-y-0 md:divide-x divide-[#E5E1DA]">
            
            {/* Order Info */}
            <div className="space-y-4">
              <h2 className="text-[#252525] font-extrabold text-sm uppercase tracking-wider">Order Meta</h2>
              <div className="space-y-2.5 text-xs text-[#55514D]">
                <div className="flex justify-between">
                  <span>Reference ID</span>
                  <span className="text-[#252525] font-bold">{orderData.orderNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span>Invoice Date</span>
                  <span className="text-[#252525] font-semibold">{new Date().toLocaleDateString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Billing Total</span>
                  <span className="text-[#252525] font-black text-sm">{formatPrice(orderData.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status</span>
                  <span className="text-[#252525] font-bold bg-[#252525] px-2 py-0.5 rounded border border-[#E5E1DA]">Processing Dispatch</span>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="space-y-4 md:pl-8 pt-6 md:pt-0">
              <h2 className="text-[#252525] font-extrabold text-sm uppercase tracking-wider">Delivery Destination</h2>
              <div className="space-y-2 text-xs text-[#55514D]">
                <p className="text-[#252525] font-bold">{orderData.firstName} {orderData.lastName}</p>
                <p>{orderData.address}</p>
                <p>{orderData.city}, {orderData.state} - {orderData.pincode}</p>
                <p className="text-[#252525] font-semibold">{orderData.phone}</p>
              </div>
            </div>

          </div>
        </div>

        {/* Item list */}
        <div className="bg-white border border-[#E5E1DA] shadow-sm rounded-2xl p-6 mb-8 space-y-4">
          <h2 className="text-[#252525] font-extrabold text-sm uppercase tracking-wider">Purchased Items</h2>
          <div className="space-y-4 divide-y divide-[#E5E1DA]">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center pt-4 first:pt-0 text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#FCFBF8] rounded-lg border border-[#E5E1DA] flex items-center justify-center p-1.5 shrink-0">
                    <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                  </div>
                  <div>
                    <h3 className="text-[#252525] font-bold">{item.name}</h3>
                    <p className="text-[#77736E] mt-0.5">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[#252525] font-black">{formatPrice(item.price * item.quantity)}</p>
                  <p className="text-[#77736E] text-[10px]">{formatPrice(item.price)} each</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Next steps pipeline */}
        <div className="bg-white border border-[#E5E1DA] shadow-sm rounded-2xl p-8 mb-8 space-y-6">
          <h2 className="text-[#252525] font-extrabold text-sm uppercase tracking-wider text-center">Fulfillment Stages</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#E5E1DA] text-[#252525] font-black flex items-center justify-center mx-auto text-xs">1</div>
              <h3 className="text-[#252525] font-bold text-xs">Verification</h3>
              <p className="text-[#77736E] text-[10px] leading-relaxed">Our clinical desk confirms equipment serial registers and calibration.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#E5E1DA] text-[#252525] font-black flex items-center justify-center mx-auto text-xs">2</div>
              <h3 className="text-[#252525] font-bold text-xs">Freight Transit</h3>
              <p className="text-[#77736E] text-[10px] leading-relaxed">Secure shipping dispatched with shock telemetry trackers.</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-[#252525] border border-[#E5E1DA] text-[#252525] font-black flex items-center justify-center mx-auto text-xs">3</div>
              <h3 className="text-[#252525] font-bold text-xs">Onsite Handover</h3>
              <p className="text-[#77736E] text-[10px] leading-relaxed">Engineer completes calibration handover and stamps warranty card.</p>
            </div>

          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate('/products')}
            className="btn-primary py-3 px-6 text-xs flex items-center gap-1.5 justify-center"
          >
            <ShoppingBag className="w-4 h-4" /> Continue Shopping
          </button>
          <button
            onClick={() => window.print()}
            className="btn-secondary py-3 px-6 text-xs flex items-center gap-1.5 justify-center"
          >
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
