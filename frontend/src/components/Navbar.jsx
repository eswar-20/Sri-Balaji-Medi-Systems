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
      : 'relative py-2 text-xs font-semibold uppercase tracking-wider transition-all hover:text-sky-600';
    
    const activeColorClass = isMobile 
      ? 'bg-sky-50 text-sky-600 border-l-4 border-sky-600' 
      : 'text-sky-600 font-bold';

    const inactiveColorClass = isMobile 
      ? 'text-slate-600 hover:bg-slate-50 hover:text-slate-900' 
      : 'text-slate-600 hover:text-slate-900';

    return `${baseClass} ${isActiveRoute(path) ? activeColorClass : inactiveColorClass}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-sky-600 to-sky-500 rounded-xl flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
              <span className="text-white font-black text-base tracking-tighter">SB</span>
            </div>
            <div>
              <h1 className="text-slate-900 font-extrabold text-base tracking-tight leading-none group-hover:text-sky-600 transition-colors">SRI BALAJI</h1>
              <p className="text-sky-600 text-[10px] uppercase font-bold tracking-widest mt-1">Medical Systems</p>
            </div>
          </Link>

          {/* Navigation Links (Desktop) */}
          <div className="hidden md:flex items-center space-x-7">
            <Link to="/" className={getLinkClass('/')}>Home</Link>
            <Link to="/products" className={getLinkClass('/products')}>Products</Link>
            <Link to="/spare-parts" className={getLinkClass('/spare-parts')}>Spare Parts</Link>
            {isCustomer && <Link to="/services/my-requests" className={getLinkClass('/services/my-requests')}>Services</Link>}
            {isCustomer && <Link to="/track-order" className={getLinkClass('/track-order')}>Track Order</Link>}
            {isTechnician && <Link to="/technician/dashboard" className={getLinkClass('/technician/dashboard')}>Technician</Link>}
            {showAdminLink && <Link to="/owner/dashboard" className={getLinkClass('/owner/dashboard')}>Admin</Link>}
            <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
          </div>

          {/* Right Action Icons */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Wishlist */}
            {user && (
              <button
                onClick={() => navigate('/wishlist')}
                className="p-2.5 text-slate-600 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all duration-200"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2.5 text-slate-600 hover:text-sky-600 hover:bg-slate-100 rounded-xl transition-all duration-200"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-sky-600 text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Operations */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-200 pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-sky-50 rounded-full flex items-center justify-center border border-sky-100">
                    <User className="w-4 h-4 text-sky-600" />
                  </div>
                  <span className="text-slate-800 text-xs font-semibold hidden lg:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1.5 hover:bg-rose-50 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-xs py-2 px-5 font-semibold shadow-sm"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-slate-600"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-sky-600 text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-200 py-3 px-4 space-y-2 animate-fade-in shadow-xl">
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
          
          <div className="border-t border-slate-200 pt-3 mt-3">
            {user ? (
              <div className="flex justify-between items-center px-4">
                <span className="text-slate-800 text-xs font-bold">{user.name}</span>
                <button
                  onClick={handleLogout}
                  className="text-xs font-bold text-rose-600 flex items-center gap-1"
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

