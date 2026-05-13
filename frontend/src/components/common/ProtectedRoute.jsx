import { Navigate } from 'react-router-dom';
import authService from '../../services/authService';

/**
 * ProtectedRoute — Route guard component.
 * Redirects to /login if user is not authenticated.
 * Wraps any child component that requires JWT auth.
 */
const ProtectedRoute = ({ children }) => {
  if (!authService.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
