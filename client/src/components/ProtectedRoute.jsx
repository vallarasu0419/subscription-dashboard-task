import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAuth } from '../features/auth/authSlice.js';
import { ROUTES } from '../utils/constants.js';
import Spinner from './Spinner.jsx';

/**
 * Guards routes by authentication and (optionally) role.
 *  - While the initial silent refresh runs, render a spinner.
 *  - If unauthenticated, redirect to login (preserving intended destination).
 *  - If a role is required and the user lacks it, redirect to the dashboard.
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { isAuthenticated, bootstrapping, user } = useSelector(selectAuth);
  const location = useLocation();

  if (bootstrapping) {
    return <Spinner center label="Restoring your session" />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;
