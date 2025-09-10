import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Redirect to login if not logged in
    return <Navigate to="/login" />;
  }

  if (adminOnly && user.role !== 'ADMIN') {
    // Redirect non-admins if adminOnly is true
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
