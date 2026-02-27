import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Loader from '../common/Loader';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Loader fullPage text="Loading..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">403</h1>
          <p className="text-xl text-gray-600 mb-8">
            You do not have permission to access this page.
          </p>
          <a
            href="/"
            className="text-blue-600 hover:text-blue-500 font-medium"
          >
            Go to Home
          </a>
        </div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
