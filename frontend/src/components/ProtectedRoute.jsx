import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRole }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Default unknown roles to 'student' to prevent infinite redirect loops
  const userRole = user.role?.toLowerCase() === 'instructor' ? 'instructor' : (user.role?.toLowerCase() === 'admin' ? 'admin' : 'student');
  const allowed = allowedRole?.toLowerCase();
  
  if (allowed && userRole !== allowed && userRole !== 'admin') {
    return <Navigate to={userRole === 'instructor' ? '/instructor' : '/student'} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
