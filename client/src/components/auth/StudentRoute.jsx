import React from 'react';
import ProtectedRoute from './ProtectedRoute';

/**
 * StudentRoute component - Only allows access to student users
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if student
 */
const StudentRoute = ({ children }) => {
  return (
    <ProtectedRoute requiredRole="student" redirectTo="/admin/dashboard">
      {children}
    </ProtectedRoute>
  );
};

export default StudentRoute;