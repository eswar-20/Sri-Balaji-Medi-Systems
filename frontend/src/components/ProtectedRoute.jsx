import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireAuth = false, requireOwner = false, requireTechnician = false }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <Loader size="large" text="Loading..." />;
  }

  if (requireAuth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireOwner && (!isAuthenticated || user?.role !== 'OWNER' || user?.email !== 'sribalajimedisystemsofficial@gmail.com')) {
    return <Navigate to="/access-denied" replace />;
  }

  if (requireTechnician && user?.role !== 'TECHNICIAN' && user?.role !== 'ROLE_TECHNICIAN') {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
};

export default ProtectedRoute;
