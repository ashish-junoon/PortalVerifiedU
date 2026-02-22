import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { authData, hasPermission } = useContext(AuthContext);
  const location = useLocation();

  if (!authData) {
    // Not logged in
    return <Navigate to="/login" replace />;
  }

  if (!hasPermission(location.pathname)) {
    // Logged in but not allowed to view this URL
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
