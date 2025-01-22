import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, token, user }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null for loading state
  const PROTECTED_URL = 'http://localhost:3000/protectedroute';

  useEffect(() => {
    const configuration = {
      method: "get",
      url: PROTECTED_URL,
      headers: {
        'Content-Type': 'application/json',
        'userId': user,
        'token': token,
      },
    };

    axios(configuration)
      .then(() => {
        setIsAuthenticated(true); // User is authenticated
      })
      .catch(() => {
        setIsAuthenticated(false); // Redirect to login
      });
  }, [token, user]);

  // While authentication check is in progress
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  // If authenticated, render children
  return children;
};

export default ProtectedRoute;
