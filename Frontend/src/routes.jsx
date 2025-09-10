import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import StoreList from './pages/StoreList.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AddStore from './pages/AddStore.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './hooks/useAuth.jsx';

const AdminRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'ADMIN') {
    alert('Only admins can access this page.');
    return <Navigate to="/dashboard" />;
  }

  return children;
};

const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
    
    {/* Protected Routes */}
    <Route path="/" element={<ProtectedRoute><StoreList /></ProtectedRoute>} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    
    {/* Add Store - admin only */}
    <Route path="/add-store" element={
      <ProtectedRoute>
        <AdminRoute>
          <AddStore />
        </AdminRoute>
      </ProtectedRoute>
    } />
    
    {/* Redirect any unknown route to dashboard */}
    <Route path="*" element={<Navigate to="/" />} />
  </Routes>
);

export default AppRoutes;
