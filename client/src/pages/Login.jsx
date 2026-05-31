import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../components/Button.jsx';
import { login, selectAuth, clearAuthError } from '../features/auth/authSlice.js';
import { validateLogin } from '../utils/validators.js';
import { ROUTES } from '../utils/constants.js';
import authStyles from './AuthLayout.module.css';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, error } = useSelector(selectAuth);

  const [form, setForm] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;
  const isSubmitting = status === 'loading';

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (error) dispatch(clearAuthError());
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const errors = validateLogin(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    const result = await dispatch(login(form));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Sign in to manage your subscription."
      footer={
        <>
          New to SubHub?{' '}
          <Link to={ROUTES.REGISTER}>Create an account</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="email">Email address</label>
          <input
            id="email"
            name="email"
            type="email"
            className={`input ${fieldErrors.email ? 'has-error' : ''}`}
            placeholder="you@company.com"
            value={form.email}
            onChange={handleChange}
            autoComplete="email"
          />
          {fieldErrors.email && <span className="field-error">{fieldErrors.email}</span>}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className={`input ${fieldErrors.password ? 'has-error' : ''}`}
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange}
            autoComplete="current-password"
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </div>

        <Button type="submit" block loading={isSubmitting}>
          Sign in
        </Button>
      </form>

      <div className={authStyles.demo}>
        <strong>Demo accounts</strong>
        <br />
        Admin — admin@example.com / Admin@123
        <br />
        User — user@example.com / User@123
      </div>
    </AuthLayout>
  );
};

export default Login;
