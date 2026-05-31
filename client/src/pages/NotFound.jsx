import { Link } from 'react-router-dom';
import Button from '../components/Button.jsx';
import { ROUTES } from '../utils/constants.js';

const NotFound = () => (
  <div
    style={{
      minHeight: '70vh',
      display: 'grid',
      placeItems: 'center',
      textAlign: 'center',
      padding: 'var(--space-6)',
    }}
  >
    <div>
      <p
        style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--fs-3xl)',
          fontWeight: 700,
          color: 'var(--primary)',
        }}
      >
        404
      </p>
      <h1 style={{ marginBottom: 'var(--space-3)' }}>Page not found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: 'var(--space-5)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button>Back to dashboard</Button>
      </Link>
    </div>
  </div>
);

export default NotFound;
