import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { bootstrapAuth, forceLogout, selectIsAuthenticated } from './features/auth/authSlice.js';
import { setOnAuthFailure } from './api/axiosClient.js';
import { useTheme } from './hooks/useTheme.js';
import { ROUTES, ROLES } from './utils/constants.js';

import DashboardLayout from './components/DashboardLayout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Plans from './pages/Plans.jsx';
import Dashboard from './pages/Dashboard.jsx';
import AdminSubscriptions from './pages/AdminSubscriptions.jsx';
import NotFound from './pages/NotFound.jsx';

/** Redirects authenticated users away from the auth pages. */
const PublicOnlyRoute = ({ children }) => {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  return isAuthenticated ? <Navigate to={ROUTES.DASHBOARD} replace /> : children;
};

const App = () => {
  const dispatch = useDispatch();
  useTheme(); // applies data-theme to <html>

  useEffect(() => {
    // Attempt a silent session restore from the refresh cookie on first load.
    dispatch(bootstrapAuth());
    // Wire the axios interceptor's terminal failure to a Redux logout.
    setOnAuthFailure(() => dispatch(forceLogout()));
  }, [dispatch]);

  return (
    <Routes>
      {/* Public routes */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicOnlyRoute>
            <Login />
          </PublicOnlyRoute>
        }
      />
      <Route
        path={ROUTES.REGISTER}
        element={
          <PublicOnlyRoute>
            <Register />
          </PublicOnlyRoute>
        }
      />

      {/* Authenticated routes share the dashboard shell */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
        <Route path={ROUTES.PLANS} element={<Plans />} />
        <Route
          path={ROUTES.ADMIN_SUBSCRIPTIONS}
          element={
            <ProtectedRoute requiredRole={ROLES.ADMIN}>
              <AdminSubscriptions />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Defaults */}
      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
