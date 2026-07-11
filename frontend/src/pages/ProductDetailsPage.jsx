import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { productAPI } from '../services/api';
import { validateProduct } from '../utils/productUtils';
import { Star, Heart, ShoppingCart, ShieldCheck, CheckCircle2, ChevronRight, Wrench, RefreshCw } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refetch, setRefetch] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchProduct = async () => {
      try {
        const resp = await productAPI.getProduct(id);
        if (mounted) {
          const apiProduct = validateProduct(resp.data);
          
          const enhancedProduct = {
            ...apiProduct,
            images: apiProduct.image ? [apiProduct.image] : ["https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"],
            rating: apiProduct.rating || 4.7,
            reviews: apiProduct.reviews || 92,
            features: apiProduct.features && apiProduct.features.length ? apiProduct.features : [
              'ISO and CE Certified safety compliance',
              'Calibrated high-precision engineering',
              'Integrated battery backup & remote diagnostics port',
              '12 Months comprehensive onsite warranty included'
            ],
            specifications: apiProduct.specifications && Object.keys(apiProduct.specifications).length ? apiProduct.specifications : {
              'Display': '12.1" Multi-color LED Screen',
              'Power': 'Dual AC / Rechargable Li-ion Battery',
              'Warranty': '1 Year Manufacturer Warranty'
            }
          };
          
          setProduct(enhancedProduct);
          setSelectedImage(0);
          setError(null);
        }
      } catch (err) {
        console.error('Error fetching product details:', err);
        if (mounted) {
          setProduct(null);
          if (err.response?.status === 404) {
            setError(null);
          } else {
            setError(err.response?.data?.message || 'Network connection failed. Please retry.');
          }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchProduct();
    return () => { mounted = false; };
  }, [id, refetch]);

  const handleAddToCart = () => {
    if (product && quantity > 0 && quantity <= product.stock) {
      addToCart(product, quantity);
      navigate('/cart');
    }
  };

  const handleQuantityChange = (value) => {
    const newQuantity = parseInt(value);
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex flex-col justify-center items-center gap-4">
        <div className="w-10 h-10 border-t-2 border-b-2 border-[#D4AF37] rounded-full animate-spin"></div>
        <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Calibrating Product Specifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex items-center justify-center p-4">
        <div className="text-center bg-[#142F52]/40 border border-white/[0.08] p-8 max-w-md rounded-2xl backdrop-blur-md">
          <h2 className="text-xl font-extrabold text-white mb-2">Sync Error</h2>
          <p className="text-slate-300 text-sm mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => {
                setError(null);
                setLoading(true);
                setRefetch(prev => prev + 1);
              }}
              className="btn-primary py-2 px-6 text-xs flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Re-sync
            </button>
            <button
              onClick={() => navigate('/products')}
              className="btn-secondary py-2 px-6 text-xs"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#071A2F] flex items-center justify-center p-4">
        <div className="text-center bg-[#142F52]/40 border border-white/[0.08] p-8 max-w-md rounded-2xl">
          <h2 className="text-xl font-extrabold text-white mb-4 font-sans">Product Catalog Mismatch</h2>
          <button
            onClick={() => navigate('/products')}
            className="btn-primary py-2 px-6 text-xs"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#071A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        {/* Breadcrumb pathing */}
        <nav className="mb-8 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <button onClick={() => navigate('/')} className="hover:text-white transition-colors">Home</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <button onClick={() => navigate('/products')} className="hover:text-white transition-colors">Catalog</button>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[#D4AF37]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Column Left: Visual Frames */}
          <div className="space-y-4">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-[#0F2745] border border-white/5 flex items-center justify-center p-6 shadow-2xl">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-contain hover:scale-105 transition-all duration-500"
                onError={(e) => {
                  e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80';
                }}
              />
              
              {/* Star badge */}
              <div className="absolute bottom-4 left-4 bg-[#071A2F]/80 backdrop-blur border border-white/10 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold text-white">
                <Star className="w-4 h-4 text-[#D4AF37] fill-[#D4AF37]" />
                <span>{product.rating}</span>
                <span className="text-slate-400 font-semibold">({product.reviews} reviews)</span>
              </div>
            </div>

            {/* Thumbnail selector */}
            <div className="flex gap-2 overflow-x-auto py-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 bg-[#0F2745] flex items-center justify-center p-2 transition-all ${
                    selectedImage === idx ? 'border-[#D4AF37]' : 'border-white/10 hover:border-white/30'
                  }`}
                >
                  <img src={img} alt={`Thumb ${idx+1}`} className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          </div>

          {/* Column Right: Info details block */}
          <div className="space-y-6">
            <div className="space-y-2">
              <span className="text-xs text-[#1D9BF0] font-black uppercase tracking-widest bg-[#1D9BF0]/10 px-3 py-1 rounded-full border border-[#1D9BF0]/20">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">{product.name}</h1>
            </div>

            {/* Pricing Panel */}
            <div className="bg-[#142F52]/40 border border-white/[0.08] p-6 rounded-2xl backdrop-blur">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-black text-[#D4AF37]">{formatPrice(product.price)}</span>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">excl. GST & shipping</span>
              </div>

              {/* Stock count indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs font-bold">
                <div className={`w-2.5 h-2.5 rounded-full ${product.stock > 0 ? 'bg-emerald-400' : 'bg-red-400'}`}></div>
                <span className={product.stock > 0 ? 'text-emerald-400' : 'text-red-400'}>
                  {product.stock > 0 ? `${product.stock} units ready for immediate shipping` : 'Temporarily Out of Stock'}
                </span>
              </div>
            </div>

            <p className="text-[#C8D3E0] text-base leading-relaxed">{product.description}</p>

            {/* Add to Cart Actions */}
            {product.stock > 0 ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-slate-300">Set Quantity:</span>
                  <div className="flex items-center border border-white/10 rounded-xl overflow-hidden bg-[#0F2745]">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="px-3.5 py-2 font-black text-slate-300 hover:bg-white/[0.04] transition-colors"
                      disabled={quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => handleQuantityChange(e.target.value)}
                      className="w-12 text-center bg-transparent text-white font-extrabold text-sm border-0 focus:ring-0 focus:outline-none"
                      min="1"
                      max={product.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="px-3.5 py-2 font-black text-slate-300 hover:bg-white/[0.04] transition-colors"
                      disabled={quantity >= product.stock}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleAddToCart}
                    className="btn-primary py-3 flex-1 font-extrabold flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-5 h-5" /> Buy Now – {formatPrice(product.price * quantity)}
                  </button>
                  <button
                    onClick={() => {
                      if (isInWishlist(product.id)) {
                        removeFromWishlist(product.id);
                      } else {
                        addToWishlist(product.id);
                      }
                    }}
                    className="btn-secondary py-3 px-5 flex items-center justify-center"
                    title="Add to Wishlist"
                  >
                    <Heart className={`w-5 h-5 ${isInWishlist(product.id) ? 'fill-red-500 text-red-500 scale-110' : 'text-slate-300 fill-none'}`} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold">
                Back-orders closed. Please contact direct support to check incoming stock ETA.
              </div>
            )}

            {/* Features block */}
            <div className="space-y-3 pt-2">
              <h3 className="text-white font-extrabold text-sm uppercase tracking-wider">Security & Quality Guarantees</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {product.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-[#C8D3E0]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Dynamic Spare Parts Compatibility specifications banner */}
        {product.specifications && (
          <div className="mt-12 space-y-6">
            <h2 className="text-xl sm:text-2xl font-extrabold text-white border-b border-white/10 pb-3">Technical Specifications</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Specs Table */}
              <div className="lg:col-span-2 bg-[#142F52]/30 border border-white/[0.06] rounded-2xl p-6 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {Object.entries(product.specifications).map(([key, value]) => (
                    <div key={key} className="flex justify-between py-2.5 border-b border-white/[0.04] text-xs">
                      <span className="text-slate-400 font-bold uppercase tracking-wider">{key}</span>
                      <span className="text-white font-semibold">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Compatibility panel if part */}
              <div className="bg-[#142F52]/40 border border-white/[0.08] p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-white font-extrabold text-sm uppercase tracking-wider flex items-center gap-2">
                  <Wrench className="w-4.5 h-4.5 text-[#D4AF37]" /> Compatibility Mapping
                </h3>
                <p className="text-xs text-[#C8D3E0] leading-relaxed">
                  This catalog unit is guaranteed compatible with the diagnostic machinery models defined in the specification matrix. For AMC system compatibility, contact technical support.
                </p>
                <div className="p-3 bg-[#071A2F]/60 rounded-xl border border-white/5 flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="text-[10px] text-slate-300 font-bold uppercase tracking-wider">Guaranteed Fit or 100% Refund</span>
                </div>
              </div>

            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetailsPage;
