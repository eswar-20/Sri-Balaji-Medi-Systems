import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import SparePartsPage from './pages/SparePartsPage';
import ProductDetailsPage from './pages/ProductDetailsPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import LoginPage from './pages/LoginPage';
import ContactPage from './pages/ContactPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';
import OrdersPage from './pages/OrdersPage';
import ProfilePage from './pages/ProfilePage';
import OwnerDashboardPage from './pages/OwnerDashboardPage';
import AccessDeniedPage from './pages/AccessDeniedPage';
import RequestServicePage from './pages/RequestServicePage';
import CustomerServicesPage from './pages/CustomerServicesPage';
import ServiceDetailsPage from './pages/ServiceDetailsPage';
import AMCDashboardPage from './pages/AMCDashboardPage';
import TechnicianDashboardPage from './pages/TechnicianDashboardPage';
import TechnicianJobDetailsPage from './pages/TechnicianJobDetailsPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  {/* Public shop routes */}
                  <Route path="/" element={<HomePage />} />
                  <Route path="/products" element={<ProductListingPage />} />
                  <Route path="/spare-parts" element={<SparePartsPage />} />
                  <Route path="/search" element={<SearchPage />} />
                  <Route path="/product/:id" element={<ProductDetailsPage />} />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/contact" element={<ContactPage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/access-denied" element={<AccessDeniedPage />} />

                  {/* Customer routes (login required) */}
                  <Route path="/checkout" element={<ProtectedRoute requireAuth><CheckoutPage /></ProtectedRoute>} />
                  <Route path="/order-success" element={<ProtectedRoute requireAuth><OrderSuccessPage /></ProtectedRoute>} />
                  <Route path="/orders" element={<ProtectedRoute requireAuth><OrdersPage /></ProtectedRoute>} />
                  <Route path="/wishlist" element={<ProtectedRoute requireAuth><WishlistPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute requireAuth><ProfilePage /></ProtectedRoute>} />
                  <Route path="/track-order" element={<ProtectedRoute requireAuth><OrderTrackingPage /></ProtectedRoute>} />
                  <Route path="/services/request" element={<ProtectedRoute requireAuth><RequestServicePage /></ProtectedRoute>} />
                  <Route path="/services/my-requests" element={<ProtectedRoute requireAuth><CustomerServicesPage /></ProtectedRoute>} />
                  <Route path="/services/requests/:id" element={<ProtectedRoute requireAuth><ServiceDetailsPage /></ProtectedRoute>} />
                  <Route path="/services/amc" element={<ProtectedRoute requireAuth><AMCDashboardPage /></ProtectedRoute>} />

                  {/* Technician routes */}
                  <Route path="/technician/dashboard" element={<ProtectedRoute requireAuth requireTechnician><TechnicianDashboardPage /></ProtectedRoute>} />
                  <Route path="/technician/jobs/:id" element={<ProtectedRoute requireAuth requireTechnician><TechnicianJobDetailsPage /></ProtectedRoute>} />

                  {/* Owner-only routes */}
                  <Route path="/owner/dashboard" element={<ProtectedRoute requireAuth requireOwner><OwnerDashboardPage /></ProtectedRoute>} />

                  {/* Block legacy admin URLs to access-denied */}
                  <Route path="/admin/*" element={<Navigate to="/access-denied" replace />} />

                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
