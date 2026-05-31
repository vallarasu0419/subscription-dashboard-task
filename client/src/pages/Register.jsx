import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from './AuthLayout.jsx';
import Button from '../components/Button.jsx';
import { register, selectAuth, clearAuthError } from '../features/auth/authSlice.js';
import { validateRegister } from '../utils/validators.js';
import { ROUTES } from '../utils/constants.js';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { status, error } = useSelector(selectAuth);

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});

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
    const errors = validateRegister(form);
    if (Object.keys(errors).length) {
      setFieldErrors(errors);
      return;
    }
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start managing subscriptions in minutes."
      footer={
        <>
          Already have an account?{' '}
          <Link to={ROUTES.LOGIN}>Sign in</Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate>
        {error && <div className="alert alert-error">{error}</div>}

        <div className="field">
          <label htmlFor="name">Full name</label>
          <input
            id="name"
            name="name"
            type="text"
            className={`input ${fieldErrors.name ? 'has-error' : ''}`}
            placeholder="Ada Lovelace"
            value={form.name}
            onChange={handleChange}
            autoComplete="name"
          />
          {fieldErrors.name && <span className="field-error">{fieldErrors.name}</span>}
        </div>

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
            placeholder="At least 6 characters"
            value={form.password}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {fieldErrors.password && (
            <span className="field-error">{fieldErrors.password}</span>
          )}
        </div>

        <Button type="submit" block loading={isSubmitting}>
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
};

export default Register;
