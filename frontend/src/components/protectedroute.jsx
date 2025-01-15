import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, token }) => {
  return token ? children : <Navigate to="/" />;
  // return token ? children : children;
};

export default ProtectedRoute;
