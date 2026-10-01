import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import EmptyState from '../components/EmptyState';
import { Trash2, Plus, Minus, ShieldCheck, Tag, ArrowRight, ArrowLeft } from 'lucide-react';

const CartPage = () => {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoError, setPromoError] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleApplyPromo = () => {
    if (promoCode.toUpperCase() === 'BALAJI10') {
      setDiscount(subtotal * 0.10);
      setPromoApplied(true);
      setPromoError('');
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const subtotal = getCartTotal();
  const discountedSubtotal = subtotal - discount;
  const shipping = subtotal > 50000 ? 0 : 1500;
  const cgst = discountedSubtotal * 0.09;
  const sgst = discountedSubtotal * 0.09;
  const total = discountedSubtotal + shipping + cgst + sgst;

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#FCFBF8] text-[#252525]">
        <div className="max-w-4xl mx-auto px-4 py-16">
          <h1 className="text-3xl font-extrabold text-[#252525] mb-8 tracking-tight">Shopping Cart</h1>
          <EmptyState
            title="Your Cart is Empty"
            description="Browse our catalog to select certified medical devices, diagnostic systems, or genuine spare parts."
            action={
              <button
                onClick={() => navigate('/products')}
                className="btn-primary py-2.5 px-6 text-sm flex items-center gap-1.5 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" /> Start Shopping
              </button>
            }
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] text-[#252525]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#252525] mb-8 tracking-tight border-b border-[#E5E1DA] pb-4">Shopping Cart</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-[#E5E1DA] rounded-2xl p-6 space-y-6 shadow-sm">
              <div className="divide-y divide-[#E5E1DA]">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex flex-col sm:flex-row gap-6 py-6 first:pt-0 last:pb-0">
                    
                    {/* Item Image */}
                    <div className="w-full sm:w-28 h-28 bg-[#FCFBF8] border border-[#E5E1DA] rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center p-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="max-w-full max-h-full object-contain"
                        onError={(e) => {
                          e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80';
                        }}
                      />
                    </div>

                    {/* Item Details */}
                    <div className="flex-grow flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#252525]">{item.category}</span>
                            <h3 className="text-[#252525] font-bold text-base leading-tight mt-0.5">{item.name}</h3>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-[#77736E] hover:text-[#252525] hover:bg-[#252525] rounded-lg transition-all"
                            title="Remove item"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        
                        {/* Qty incrementer */}
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-[#77736E] font-semibold">Qty:</span>
                          <div className="flex items-center border border-[#E5E1DA] rounded-lg overflow-hidden bg-white">
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="px-2.5 py-1 text-[#55514D] hover:bg-[#FCFBF8] transition-colors"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                              className="w-10 text-center bg-transparent border-0 text-[#252525] font-bold text-xs focus:ring-0 focus:outline-none"
                              min="1"
                            />
                            <button
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="px-2.5 py-1 text-[#55514D] hover:bg-[#FCFBF8] transition-colors"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="text-[#252525] font-extrabold text-base">{formatPrice(item.price * item.quantity)}</p>
                          <p className="text-[#77736E] text-[10px] font-medium mt-0.5">{formatPrice(item.price)} each</p>
                        </div>

                      </div>
                    </div>

                  </div>
                ))}
              </div>

              {/* Continue Shopping button */}
              <div className="pt-6 border-t border-[#E5E1DA]">
                <button
                  onClick={() => navigate('/products')}
                  className="btn-secondary text-xs"
                >
                  Continue Shopping
                </button>
              </div>

            </div>
          </div>

          {/* Column Right: Billing Invoice details */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-[#E5E1DA] p-6 rounded-2xl sticky top-24 space-y-6 shadow-sm">
              <h2 className="text-[#252525] font-bold text-sm tracking-wide uppercase border-b border-[#E5E1DA] pb-3">Billing Summary</h2>

              <div className="space-y-3.5 text-xs text-[#55514D]">
                
                <div className="flex justify-between">
                  <span>Subtotal ({cartItems.reduce((total, item) => total + item.quantity, 0)} units)</span>
                  <span className="text-[#252525] font-semibold">{formatPrice(subtotal)}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between text-[#252525] font-semibold">
                    <span>Discount (10% Promo)</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Transport & Delivery</span>
                  <span className="text-[#252525] font-semibold">{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
                </div>

                {shipping > 0 && (
                  <p className="text-[10px] text-[#252525] leading-relaxed font-semibold">
                    Add {formatPrice(50000 - subtotal)} more for free hospital shipping
                  </p>
                )}

                <div className="flex justify-between">
                  <span>CGST (9%)</span>
                  <span className="text-[#252525] font-semibold">{formatPrice(cgst)}</span>
                </div>

                <div className="flex justify-between">
                  <span>SGST (9%)</span>
                  <span className="text-[#252525] font-semibold">{formatPrice(sgst)}</span>
                </div>

                <div className="border-t border-[#E5E1DA] pt-4 flex justify-between text-base text-[#252525] font-extrabold">
                  <span>Total Amount</span>
                  <span className="text-[#252525]">{formatPrice(total)}</span>
                </div>

              </div>

              <button
                onClick={() => navigate('/checkout')}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2 font-bold text-sm shadow-md"
              >
                Proceed to Checkout <ArrowRight className="w-4.5 h-4.5" />
              </button>

              {/* Promo Code detail drawer */}
              <div className="border-t border-[#E5E1DA] pt-4">
                <div className="space-y-3">
                  <span className="text-xs font-semibold text-[#252525] flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-[#252525]" /> Coupon Code
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. BALAJI10"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      disabled={promoApplied}
                      className="input-field flex-grow text-xs uppercase"
                    />
                    <button 
                      onClick={handleApplyPromo}
                      disabled={promoApplied}
                      className="btn-secondary text-xs px-4 py-2"
                    >
                      {promoApplied ? 'Applied' : 'Apply'}
                    </button>
                  </div>
                  {promoError && <p className="text-[#252525] text-[10px] font-bold">{promoError}</p>}
                </div>
              </div>

              {/* Secure Checkout indicator */}
              <div className="border-t border-[#E5E1DA] pt-4 flex items-center justify-center gap-2 text-[#77736E] text-[10px] font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#252525]" />
                <span>128-bit Encrypted Checkout</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CartPage;

