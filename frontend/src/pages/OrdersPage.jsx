import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { orderAPI } from '../services/api';
import { Package, Calendar, MapPin, ChevronRight, RefreshCw } from 'lucide-react';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchOrders = async () => {
      try {
        const resp = await orderAPI.getMyOrders();
        if (mounted) {
          setOrders(Array.isArray(resp.data) ? resp.data : []);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching orders:', err);
        if (mounted) {
          setError(err.response?.data?.message || 'Failed to retrieve order history. Please check your connection.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => { mounted = false; };
  }, [refetch]);

  if (loading) return <Loader size="large" text="Loading orders..." />;

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center card p-8 max-w-md bg-white border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Connection Error</h2>
          <p className="text-slate-600 text-sm mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setRefetch(prev => prev + 1);
            }}
            className="btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
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
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Your Medical Orders</h1>
            <p className="text-slate-500 text-sm mt-1">Track and manage hospital equipment and parts purchases</p>
          </div>
          <span className="self-start sm:self-auto px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-50 text-sky-700 border border-sky-200">
            {orders.length} Total Orders
          </span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
            <EmptyState 
              title="No orders yet" 
              description="Your order history will appear here once you make your first machinery or spare parts purchase." 
              action={<Link to="/products" className="btn-primary">Browse Equipment</Link>} 
            />
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center font-bold">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-slate-900 font-bold text-sm sm:text-base">Order #{order.id}</p>
                      <p className="text-slate-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-1">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {order.status}
                    </span>
                    <p className="text-slate-900 font-extrabold text-base">{formatPrice(order.totalPrice)}</p>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-600">
                  <p className="flex items-center gap-1.5 truncate max-w-xl">
                    <MapPin className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{order.address}, {order.city} - {order.pincode}</span>
                  </p>
                  <Link 
                    to={`/track-order?orderId=${order.id}`} 
                    className="inline-flex items-center gap-1.5 text-sky-700 hover:text-sky-800 font-bold transition-colors"
                  >
                    Track Status <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
