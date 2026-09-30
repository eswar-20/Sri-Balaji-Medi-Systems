import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { Search, Package, ChevronRight, X, Phone, Mail } from 'lucide-react';

const OrderTrackingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    let mounted = true;
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const resp = await orderAPI.getMyOrders();
        if (mounted) {
          const formatted = Array.isArray(resp.data) ? resp.data.map(order => ({
            id: order.id,
            orderNumber: `ME-${order.id}`,
            customerName: order.customerName,
            email: user.email,
            phone: order.phone,
            address: order.address,
            city: order.city,
            state: 'Andhra Pradesh',
            pincode: order.pincode,
            total: Number(order.totalPrice) || 0,
            paymentMethod: 'Cash on Delivery (COD)',
            status: order.status ? order.status.toLowerCase() : 'pending',
            createdAt: order.createdAt,
            items: Array.isArray(order.orderItems) ? order.orderItems.map(item => ({
              name: item.productName || 'Medical Product',
              quantity: item.quantity,
              price: Number(item.price) || 0,
              image: item.productImageUrl || '/api/placeholder/100/100'
            })) : []
          })) : [];

          setOrders(formatted);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => { mounted = false; };
  }, [user]);

  const getStatusDetails = (status) => {
    switch (status) {
      case 'pending': 
        return { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Order Placed', step: 1 };
      case 'processing': 
        return { color: 'text-[#1D9BF0] bg-[#1D9BF0]/10 border-[#1D9BF0]/20', label: 'Safety Check', step: 2 };
      case 'shipped': 
        return { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'In Transit', step: 3 };
      case 'delivered': 
        return { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Delivered', step: 4 };
      case 'cancelled': 
        return { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Cancelled', step: 0 };
      default: 
        return { color: 'text-slate-400 bg-slate-500/10 border-slate-500/20', label: 'Acknowledged', step: 1 };
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const filteredOrders = orders.filter(order => {
    const matchesFilter = filter === 'all' || order.status === filter;
    const matchesSearch = searchTerm === '' || 
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return <Loader size="large" text="Reading Order Records..." />;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm">
          <div className="mx-auto w-12 h-12 bg-sky-50 border border-sky-200 rounded-xl flex items-center justify-center text-sky-700 mb-4">
            <Package className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-extrabold text-slate-900 mb-2">Order History</h1>
          <p className="text-slate-600 text-xs mb-6">Please login to track your medical machinery dispatches.</p>
          <button onClick={() => navigate('/login')} className="btn-primary py-2.5 px-6 text-xs w-full">
            Login Account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="mb-10 text-center space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Order Tracking</h1>
          <p className="text-slate-600 text-sm">Monitor freight details, calibration schedules, and handover signatures.</p>
        </div>

        {/* Filter controls */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            
            {/* Search */}
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                type="text"
                placeholder="Search Reference ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-10 text-xs"
              />
            </div>

            {/* Select filter */}
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="input-field w-full text-xs"
              >
                <option value="all">All Deliveries</option>
                <option value="pending">Pending</option>
                <option value="processing">Safety Check</option>
                <option value="shipped">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider text-right md:pr-4">
              Results: <span className="text-slate-900 font-extrabold">{filteredOrders.length}</span> of {orders.length} orders
            </div>

          </div>
        </div>

        {/* List of dispatches */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <EmptyState
              title="No dispatches found"
              description="We couldn't locate any active delivery tracking records. Click below to browse our inventory catalog."
              action={
                <button onClick={() => navigate('/products')} className="btn-primary py-2.5 px-6 text-xs flex items-center gap-1">
                  Browse Machinery <ChevronRight className="w-4 h-4" />
                </button>
              }
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredOrders.map((order) => {
              const status = getStatusDetails(order.status);
              return (
                <div key={order.orderNumber} className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col justify-between hover:shadow-md transition-all">
                  
                  <div className="space-y-4">
                    
                    {/* Header line */}
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <span className="text-sky-700 text-xs font-black tracking-wider uppercase">{order.orderNumber}</span>
                        <p className="text-[10px] text-slate-500 font-semibold mt-1">Booked on {formatDate(order.createdAt)}</p>
                      </div>
                      <span className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border ${status.color}`}>
                        {status.label}
                      </span>
                    </div>

                    {/* Details grid */}
                    <div className="space-y-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                      <div className="flex justify-between">
                        <span>Grand Total</span>
                        <span className="text-slate-900 font-bold">{formatPrice(order.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Items Count</span>
                        <span className="text-slate-900 font-bold">{order.items.length} units</span>
                      </div>
                    </div>

                  </div>

                  <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="btn-primary py-2 flex-grow text-xs font-bold flex items-center justify-center gap-1"
                    >
                      <Package className="w-3.5 h-3.5" /> Details
                    </button>
                    <button
                      onClick={() => navigate('/contact')}
                      className="btn-secondary py-2 flex-grow text-xs font-bold"
                    >
                      Support
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

        {/* Modal details drawer with visual pipeline */}
        {selectedOrder && (() => {
          const details = getStatusDetails(selectedOrder.status);
          return (
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 z-50">
              <div className="bg-white border border-slate-200 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
                <div className="p-6 sm:p-8 space-y-6">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start border-b border-slate-100 pb-4">
                    <div>
                      <h2 className="text-xl font-extrabold text-slate-900">Fulfillment Details</h2>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">Reference: {selectedOrder.orderNumber}</p>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-900">
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Visual timeline pipeline */}
                  {details.step > 0 && (
                    <div className="space-y-4 bg-slate-50 border border-slate-200 p-6 rounded-2xl">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider text-center">Stage Progress</h3>
                      
                      <div className="flex items-center justify-between gap-2 max-w-md mx-auto">
                        
                        {/* Step 1: Placed */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${details.step >= 1 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'}`}>1</div>
                          <span className="text-[9px] font-bold text-slate-600 mt-1.5 uppercase">Placed</span>
                        </div>
                        <div className={`flex-grow h-0.5 ${details.step >= 2 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>

                        {/* Step 2: Calibrated */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${details.step >= 2 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'}`}>2</div>
                          <span className="text-[9px] font-bold text-slate-600 mt-1.5 uppercase">Calibrated</span>
                        </div>
                        <div className={`flex-grow h-0.5 ${details.step >= 3 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>

                        {/* Step 3: Shipped */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${details.step >= 3 ? 'bg-sky-600 text-white' : 'bg-slate-200 text-slate-500'}`}>3</div>
                          <span className="text-[9px] font-bold text-slate-600 mt-1.5 uppercase">Transit</span>
                        </div>
                        <div className={`flex-grow h-0.5 ${details.step >= 4 ? 'bg-sky-600' : 'bg-slate-200'}`}></div>

                        {/* Step 4: Handover */}
                        <div className="flex flex-col items-center">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${details.step >= 4 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-500'}`}>4</div>
                          <span className="text-[9px] font-bold text-slate-600 mt-1.5 uppercase">Delivered</span>
                        </div>

                      </div>
                    </div>
                  )}

                  {/* Customer, Shipping and Items grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600">
                    <div className="space-y-4">
                      
                      <div>
                        <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-2">Hospital Contact</h4>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">{selectedOrder.customerName}</p>
                          <p className="flex items-center gap-1 text-sky-700 font-medium"><Phone className="w-3.5 h-3.5" /> {selectedOrder.phone}</p>
                          <p className="flex items-center gap-1 text-slate-500"><Mail className="w-3.5 h-3.5" /> {selectedOrder.email}</p>
                        </div>
                      </div>

                    </div>

                    <div className="space-y-4">
                      
                      <div>
                        <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider mb-2">Delivery Address</h4>
                        <div className="space-y-1">
                          <p className="text-slate-900 font-semibold">{selectedOrder.address}</p>
                          <p>{selectedOrder.city}, {selectedOrder.state} - {selectedOrder.pincode}</p>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Purchased items list */}
                  <div className="space-y-3">
                    <h4 className="text-slate-900 font-extrabold text-xs uppercase tracking-wider">Order Items</h4>
                    <div className="space-y-2.5 max-h-40 overflow-y-auto divide-y divide-slate-100">
                      {selectedOrder.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pt-2.5 first:pt-0 text-xs">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-center p-1.5 shrink-0">
                              <img src={item.image} alt={item.name} className="max-w-full max-h-full object-contain" />
                            </div>
                            <div>
                              <p className="text-slate-900 font-bold">{item.name}</p>
                              <p className="text-slate-500 text-[10px]">Qty: {item.quantity}</p>
                            </div>
                          </div>
                          <span className="text-slate-900 font-bold">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Total price billing */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex justify-between items-center text-sm font-extrabold">
                    <span className="text-slate-600">Grand Total Billing</span>
                    <span className="text-sky-700 text-base">{formatPrice(selectedOrder.total)}</span>
                  </div>

                  <div className="flex gap-4 pt-2">
                    <button onClick={() => setSelectedOrder(null)} className="btn-primary py-2.5 flex-grow text-xs font-bold">
                      Close Window
                    </button>
                  </div>

                </div>
              </div>
            </div>
          );
        })()}

      </div>
    </div>
  );
};

export default OrderTrackingPage;
