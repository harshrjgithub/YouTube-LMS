import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Loader2 } from 'lucide-react';

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props
 * @param {React.ReactNode} props.children - Child components to render if authorized
 * @param {string} props.requiredRole - Required role ('admin' or 'student')
 * @param {string} props.redirectTo - Where to redirect if not authorized
 */
const ProtectedRoute = ({ 
  children, 
  requiredRole = null, 
  redirectTo = '/login' 
}) => {
  const { isAuthenticated, isLoading, user, isAdmin, isStudent } = useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requiredRole) {
    if (requiredRole === 'admin' && !isAdmin()) {
      console.warn(`🚫 Access denied: User ${user?.email} (${user?.role}) tried to access admin route`);
      return <Navigate to="/" replace />;
    }
    
    if (requiredRole === 'student' && !isStudent()) {
      console.warn(`🚫 Access denied: User ${user?.email} (${user?.role}) tried to access student route`);
      return <Navigate to="/admin/dashboard" replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

export default ProtectedRoute;