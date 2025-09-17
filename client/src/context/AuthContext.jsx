import React, { createContext, useContext, useEffect, useState } from 'react';
import { useGetUserProfileQuery } from '@/features/api/authApi';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Get user profile to check authentication status
  const { 
    data: profileData, 
    isLoading: profileLoading, 
    error: profileError,
    refetch: refetchProfile 
  } = useGetUserProfileQuery(undefined, {
    skip: false, // Always try to fetch profile on mount
  });

  useEffect(() => {
    if (profileLoading) {
      setIsLoading(true);
      return;
    }

    if (profileData?.success && profileData?.user) {
      // User is authenticated
      setUser(profileData.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      console.log('✅ User authenticated:', profileData.user.email, `(${profileData.user.role})`);
    } else {
      // User is not authenticated or error occurred
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      if (profileError) {
        console.log('❌ Authentication failed:', profileError);
      }
    }
  }, [profileData, profileLoading, profileError]);

  const login = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    refetchProfile(); // Refetch to get latest user data
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    // Clear any cached data
    window.location.href = '/login';
  };

  const isAdmin = () => {
    return user?.role === 'admin' && user?.email === 'adminlms@gmail.com';
  };

  const isStudent = () => {
    return user?.role === 'student';
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    isAdmin,
    isStudent,
    refetchProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};