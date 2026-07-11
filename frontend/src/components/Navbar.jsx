import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, LogOut, User, Menu, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { cartItems } = useContext(CartContext);
  const { user, logout, isCustomer, isTechnician } = useAuth();
  const showAdminLink = user?.role === 'OWNER' && user?.email === 'sribalajimedisystemsofficial@gmail.com';
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartItemsCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActiveRoute = (path) => {
    if (path === '/') return location.pathname === '/';
    if (path === '/products') return location.pathname.startsWith('/products') || location.pathname.startsWith('/product/');
    if (path === '/services/my-requests') return location.pathname.startsWith('/services');
    if (path === '/technician/dashboard') return location.pathname.startsWith('/technician');
    if (path === '/owner/dashboard') return location.pathname.startsWith('/owner');
    return location.pathname.startsWith(path);
  };

  const getLinkClass = (path, isMobile = false) => {
    const baseClass = isMobile 
      ? 'block px-4 py-2.5 rounded-lg text-sm font-semibold tracking-wide transition-all'
      : 'relative py-2 text-xs font-bold uppercase tracking-wider transition-all hover:text-[#D4AF37]';
    
    const activeColorClass = isMobile 
      ? 'bg-[#1D9BF0]/10 text-[#1D9BF0] border-l-4 border-[#1D9BF0]' 
      : 'text-[#D4AF37] font-extrabold';

    const inactiveColorClass = isMobile 
      ? 'text-slate-300 hover:bg-white/[0.04] hover:text-white' 
      : 'text-slate-300 hover:text-white';

    return `${baseClass} ${isActiveRoute(path) ? activeColorClass : inactiveColorClass}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#071A2F]/80 backdrop-blur-md border-b border-white/[0.06] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-[#1D9BF0] to-[#D4AF37] rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-all duration-300">
              <span className="text-[#071A2F] font-black text-base tracking-tighter">SB</span>
            </div>
            <div>
              <h1 className="text-white font-extrabold text-base tracking-tight leading-none group-hover:text-[#1D9BF0] transition-colors">SRI BALAJI</h1>
              <p className="text-[#D4AF37] text-[10px] uppercase font-bold tracking-widest mt-1">Medical Systems</p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/products" className={getLinkClass('/products')}>Products</Link>
            <Link to="/spare-parts" className={getLinkClass('/spare-parts')}>Spare Parts</Link>
            {isCustomer && <Link to="/services/my-requests" className={getLinkClass('/services/my-requests')}>Services</Link>}
            {isCustomer && <Link to="/track-order" className={getLinkClass('/track-order')}>Track Order</Link>}
            {isTechnician && <Link to="/technician/dashboard" className={getLinkClass('/technician/dashboard')}>Technician Dashboard</Link>}
            {showAdminLink && <Link to="/owner/dashboard" className={getLinkClass('/owner/dashboard')}>Owner Dashboard</Link>}
            <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Wishlist */}
            {user && (
              <button
                onClick={() => navigate('/wishlist')}
                className="p-2.5 text-slate-300 hover:text-red-400 hover:bg-white/[0.04] rounded-xl transition-all duration-200"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2.5 text-slate-300 hover:text-[#1D9BF0] hover:bg-white/[0.04] rounded-xl transition-all duration-200"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#D4AF37] text-[#071A2F] text-[10px] font-black rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Operations */}
            {user ? (
              <div className="flex items-center space-x-4 border-l border-white/10 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-white/[0.06] rounded-full flex items-center justify-center border border-white/10">
                    <User className="w-4 h-4 text-slate-300" />
                  </div>
                  <span className="text-white text-xs font-bold hidden lg:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center gap-1.5 hover:bg-red-500/10 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-xs py-2 px-5 font-bold"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-slate-300"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#D4AF37] text-[#071A2F] text-[9px] font-black rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0F2745] border-t border-white/[0.06] py-3 px-4 space-y-2 animate-fade-in shadow-2xl">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/', true)}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/products', true)}>Products</Link>
          <Link to="/spare-parts" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/spare-parts', true)}>Spare Parts</Link>
          {isCustomer && <Link to="/services/my-requests" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/services/my-requests', true)}>Services</Link>}
          {isCustomer && <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/track-order', true)}>Track Order</Link>}
          {isTechnician && <Link to="/technician/dashboard" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/technician/dashboard', true)}>Technician Dashboard</Link>}
          {showAdminLink && <Link to="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/owner/dashboard', true)}>Owner Dashboard</Link>}
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/contact', true)}>Contact</Link>
          {user && (
            <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/wishlist', true)}>Wishlist</Link>
          )}
          
          <div className="border-t border-white/10 pt-3 mt-3">
            {user ? (
              <div className="flex justify-between items-center px-4">
                <span className="text-white text-xs font-bold">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-red-400 flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => { navigate('/login'); setMobileMenuOpen(false); }}
                className="w-full btn-primary py-2.5 text-xs text-center font-bold"
              >
                Login Account
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
