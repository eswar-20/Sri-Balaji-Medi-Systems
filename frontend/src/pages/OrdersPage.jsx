import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from '../components/Loader';
import EmptyState from '../components/EmptyState';
import { orderAPI } from '../services/api';

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
      <div className="min-h-screen bg-matte-black flex items-center justify-center">
        <div className="text-center card p-8 max-w-md border border-red-900/30">
          <h2 className="text-2xl font-bold text-beige mb-4">Connection Error</h2>
          <p className="text-light-gray mb-6">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setLoading(true);
              setRefetch(prev => prev + 1);
            }}
            className="btn-primary"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-matte-black">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-beige mb-2">Your Orders</h1>
        <p className="text-light-gray mb-8">{orders.length} orders</p>
        {orders.length === 0 ? (
          <EmptyState title="No orders yet" description="Your order history will appear here" action={<Link to="/products" className="btn-primary">Start Shopping</Link>} />
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="card p-6">
                <div className="flex flex-wrap justify-between gap-4 mb-3">
                  <div>
                    <p className="text-beige font-semibold">Order #{order.id}</p>
                    <p className="text-light-gray text-sm">{new Date(order.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs bg-muted-gold/20 text-muted-gold">{order.status}</span>
                    <p className="text-beige font-bold mt-2">${Number(order.totalPrice).toFixed(2)}</p>
                  </div>
                </div>
                <p className="text-light-gray text-sm">{order.address}, {order.city} - {order.pincode}</p>
                <Link to={`/track-order?orderId=${order.id}`} className="text-muted-gold text-sm mt-3 inline-block hover:underline">Track order</Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
