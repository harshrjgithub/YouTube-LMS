import React from 'react';
import ProtectedRoute from './ProtectedRoute';

/**
 * AdminRoute component - Only allows access to the exclusive admin user
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if admin
 */
const AdminRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="admin" redirectTo="/">
      {children}
    </ProtectedRoute>
  );
};

export default AdminRoute;