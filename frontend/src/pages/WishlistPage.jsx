import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import EmptyState from '../components/EmptyState';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ArrowLeft } from 'lucide-react';

const SkeletonCard = () => (
  <div className="bg-[#142F52]/30 border border-white/[0.06] p-4 rounded-2xl h-[400px] flex flex-col justify-between overflow-hidden relative">
    <div className="aspect-square w-full rounded-xl bg-white/[0.04] shimmer"></div>
    <div className="space-y-3 mt-4 flex-grow">
      <div className="h-3 w-1/4 bg-white/[0.04] rounded shimmer"></div>
      <div className="h-5 w-3/4 bg-white/[0.04] rounded shimmer"></div>
    </div>
    <div className="flex justify-between items-center mt-4 pt-3 border-t border-white/[0.06]">
      <div className="h-4 w-1/4 bg-white/[0.04] rounded shimmer"></div>
      <div className="h-10 w-10 bg-white/[0.04] rounded-xl shimmer"></div>
    </div>
  </div>
);

const WishlistPage = () => {
  const { wishlistItems, loading } = useWishlist();

  return (
    <div className="min-h-screen bg-[#071A2F] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Header Block */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#D4AF37]">
              <Heart className="w-5 h-5 fill-[#D4AF37]" />
              <span className="text-xs uppercase font-extrabold tracking-widest">Saved Inventory</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">Your Wishlist</h1>
            <p className="text-[#C8D3E0] text-sm">
              {loading ? 'Reading database...' : `${wishlistItems.length} medical items saved`}
            </p>
          </div>
          <div className="w-16 h-1 bg-[#1D9BF0] rounded-full hidden md:block"></div>
        </div>

        {/* Content Block */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => <SkeletonCard key={i} />)}
          </div>
        ) : wishlistItems.length === 0 ? (
          <EmptyState 
            title="Your Wishlist is Empty" 
            description="Keep track of clinical machinery and vital spare parts you need by clicking the heart button on any product card." 
            action={
              <Link to="/products" className="btn-primary py-2.5 px-6 text-sm flex items-center gap-1.5">
                <ArrowLeft className="w-4 h-4" /> Browse Catalog
              </Link>
            } 
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
