import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, Heart, LogOut, User, Menu, X } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import monogramLogo from '../assets/sbms-monogram-color.png';

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
      : 'relative py-2 text-xs font-semibold uppercase tracking-wider transition-all';
    
    const activeColorClass = isMobile 
      ? 'bg-[#F7F5F0] text-[#252525] font-bold border-l-4 border-[#252525]' 
      : 'text-[#252525] font-bold';

    const inactiveColorClass = isMobile 
      ? 'text-[#77736E] hover:bg-[#F7F5F0] hover:text-[#252525]' 
      : 'text-[#77736E] hover:text-[#252525]';

    return `${baseClass} ${isActiveRoute(path) ? activeColorClass : inactiveColorClass}`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-[#FCFBF8]/95 backdrop-blur-md border-b border-[#E5E1DA] transition-all duration-300 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Brand Logo with Standalone Monogram */}
          <Link to="/" className="flex items-center space-x-3 group select-none">
            <img
              src={monogramLogo}
              alt="Sri Balaji Medi Systems Monogram"
              className="h-10 sm:h-11 w-auto object-contain filter drop-shadow-sm group-hover:scale-105 transition-transform duration-300"
            />
            <div>
              <h1 className="text-[#252525] font-extrabold text-base sm:text-lg tracking-tight leading-none">
                SRI BALAJI
              </h1>
              <p className="text-[#77736E] text-[10px] uppercase font-bold tracking-[0.2em] mt-1">
                MEDI SYSTEMS
              </p>
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
                className="p-2.5 text-[#77736E] hover:text-[#252525] hover:bg-[#F7F5F0] rounded-xl transition-all duration-200"
                title="Wishlist"
              >
                <Heart className="w-5 h-5" />
              </button>
            )}

            {/* Cart Icon */}
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2.5 text-[#77736E] hover:text-[#252525] hover:bg-[#F7F5F0] rounded-xl transition-all duration-200"
              title="Cart"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 bg-[#252525] text-white text-[10px] font-bold rounded-full w-4.5 h-4.5 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>

            {/* Auth Operations */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-[#E5E1DA] pl-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-[#F7F5F0] rounded-full flex items-center justify-center border border-[#E5E1DA]">
                    <User className="w-4 h-4 text-[#252525]" />
                  </div>
                  <span className="text-[#252525] text-xs font-semibold hidden lg:inline">{user.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="text-xs font-semibold text-neutral-600 hover:text-neutral-900 flex items-center gap-1.5 hover:bg-neutral-100 px-3 py-1.5 rounded-lg transition-all duration-200"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="btn-primary text-xs py-2 px-5 font-semibold"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-3">
            <button
              onClick={() => navigate('/cart')}
              className="relative p-2 text-[#77736E]"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#252525] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#77736E] hover:text-[#252525]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E5E1DA] bg-[#FCFBF8] px-4 pt-3 pb-5 space-y-2">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/', true)}>Home</Link>
          <Link to="/products" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/products', true)}>Products</Link>
          <Link to="/spare-parts" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/spare-parts', true)}>Spare Parts</Link>
          {isCustomer && <Link to="/services/my-requests" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/services/my-requests', true)}>Services</Link>}
          {isCustomer && <Link to="/track-order" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/track-order', true)}>Track Order</Link>}
          {isTechnician && <Link to="/technician/dashboard" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/technician/dashboard', true)}>Technician Dashboard</Link>}
          {showAdminLink && <Link to="/owner/dashboard" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/owner/dashboard', true)}>Admin Control</Link>}
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} className={getLinkClass('/contact', true)}>Contact</Link>
          
          <div className="pt-4 border-t border-[#E5E1DA]">
            {user ? (
              <button
                onClick={handleLogout}
                className="w-full py-2.5 text-center text-sm font-bold text-neutral-700 hover:bg-neutral-100 rounded-xl"
              >
                Logout ({user.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate('/login');
                  setMobileMenuOpen(false);
                }}
                className="btn-primary w-full py-3 text-sm font-bold"
              >
                Login
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
