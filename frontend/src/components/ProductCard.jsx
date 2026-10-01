import React from 'react';
import { Link } from 'react-router-dom';
import { validateProduct } from '../utils/productUtils';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { Heart, ShoppingCart, Star, Eye } from 'lucide-react';

const ProductCard = ({ product }) => {
  const validatedProduct = validateProduct(product);
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(validatedProduct, 1);
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist(validatedProduct.id)) {
      removeFromWishlist(validatedProduct.id);
    } else {
      addToWishlist(validatedProduct.id);
    }
  };

  return (
    <div className="product-card group relative flex flex-col justify-between p-4 h-full bg-white border border-[#E5E1DA] hover:border-[#252525] rounded-2xl transition-all duration-300 shadow-sm hover:shadow-md">
      
      {/* Upper Wrapper (Image & Badges) */}
      <Link to={`/product/${validatedProduct.id}`} className="block flex-grow">
        
        {/* Image Frame */}
        <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#FCFBF8] border border-[#E5E1DA] mb-4 flex items-center justify-center">
          <img
            src={validatedProduct.image}
            alt={validatedProduct.name}
            className="w-full h-full object-contain p-3 group-hover:scale-105 transition-all duration-500"
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=400&q=80';
            }}
          />

          {/* Quick Action Overlay */}
          <div className="absolute inset-0 bg-[#252525]/10 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-3 transition-opacity duration-300 pointer-events-none">
            <div className="w-10 h-10 rounded-full bg-white border border-[#E5E1DA] flex items-center justify-center text-[#252525] shadow-md">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          {/* Wishlist Button */}
          <button
            onClick={toggleWishlist}
            className="absolute top-2.5 right-2.5 p-2 rounded-xl bg-white/95 hover:bg-white border border-[#E5E1DA] text-[#77736E] hover:text-[#252525] transition-all z-10 shadow-sm"
            title="Wishlist"
          >
            <Heart 
              className={`w-4 h-4 transition-all ${
                isInWishlist(validatedProduct.id) ? 'fill-[#252525] text-[#252525] scale-110' : 'text-[#77736E] fill-none'
              }`} 
            />
          </button>

          {/* Stock status indicator */}
          {validatedProduct.stock <= 0 && (
            <span className="absolute bottom-2.5 left-2.5 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-[#F7F5F0] text-[#77736E] border border-[#E5E1DA] rounded-lg shadow-sm">
              Out of stock
            </span>
          )}
        </div>

        {/* Text Block */}
        <div className="space-y-1 px-1">
          <span className="text-[10px] text-[#77736E] font-bold uppercase tracking-wider">
            {validatedProduct.category}
          </span>
          <h3 className="text-[#252525] font-bold text-base line-clamp-1 group-hover:text-black transition-colors leading-tight">
            {validatedProduct.name}
          </h3>
          <p className="text-[#77736E] text-xs line-clamp-2 leading-relaxed pt-0.5">
            {validatedProduct.description}
          </p>
        </div>
      </Link>

      {/* Footer Block */}
      <div className="mt-4 pt-3 border-t border-[#E5E1DA] flex items-center justify-between px-1">
        <div className="space-y-0.5">
          <div className="flex items-center gap-1">
            <div className="flex text-neutral-400">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-3 h-3 ${i < Math.floor(validatedProduct.rating || 0) ? 'fill-neutral-400' : 'text-neutral-200 fill-none'}`} 
                />
              ))}
            </div>
            <span className="text-[10px] text-[#77736E] font-medium">({validatedProduct.reviews})</span>
          </div>
          <p className="text-[#252525] font-extrabold text-base tracking-tight">
            {formatPrice(validatedProduct.price)}
          </p>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={validatedProduct.stock <= 0}
          className="p-2.5 rounded-xl bg-[#252525] hover:bg-[#111111] disabled:bg-[#F7F5F0] disabled:text-[#77736E] text-white font-bold flex items-center justify-center hover:scale-105 active:scale-100 disabled:scale-100 transition-all shadow-sm"
          title="Add to Cart"
        >
          <ShoppingCart className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
};

export default ProductCard;
