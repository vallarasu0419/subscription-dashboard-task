import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import SubscriptionStatusCard from '../components/SubscriptionStatusCard.jsx';
import Spinner from '../components/Spinner.jsx';
import ErrorState from '../components/ErrorState.jsx';
import Button from '../components/Button.jsx';
import { useAuth } from '../hooks/useAuth.js';
import {
  fetchMySubscription,
  selectSubscriptions,
} from '../features/subscriptions/subscriptionsSlice.js';
import { SUBSCRIPTION_STATUS, ROUTES } from '../utils/constants.js';
import { daysRemaining } from '../utils/format.js';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { current, currentStatus, error } = useSelector(selectSubscriptions);

  useEffect(() => {
    dispatch(fetchMySubscription());
  }, [dispatch]);

  const status = current?.status || 'none';
  const isActive = status === SUBSCRIPTION_STATUS.ACTIVE;

  const stats = [
    {
      label: 'Plan',
      value: current?.plan?.name || 'None',
    },
    {
      label: 'Status',
      value: status === 'none' ? 'No plan' : status,
    },
    {
      label: 'Days remaining',
      value: isActive ? daysRemaining(current.endDate) : '—',
    },
  ];

  return (
    <div>
      <header className="page-header">
        <h1>Hi {user?.name?.split(' ')[0] || 'there'} 👋</h1>
        <p>Here&apos;s an overview of your subscription.</p>
      </header>

      {currentStatus === 'loading' && <Spinner center label="Loading your subscription" />}

      {currentStatus === 'failed' && (
        <ErrorState message={error} onRetry={() => dispatch(fetchMySubscription())} />
      )}

      {currentStatus === 'succeeded' && (
        <div className={styles.layout}>
          <SubscriptionStatusCard subscription={current} />

          <div className={styles.side}>
            <div className={styles.stats}>
              {stats.map((stat) => (
                <div key={stat.label} className={styles.stat}>
                  <span className={styles.statLabel}>{stat.label}</span>
                  <span className={styles.statValue}>{stat.value}</span>
                </div>
              ))}
            </div>

            <div className={`card ${styles.cta}`}>
              <h3 className={styles.ctaTitle}>
                {isActive ? 'Want to change plans?' : 'Get started'}
              </h3>
              <p className={styles.ctaText}>
                {isActive
                  ? 'Browse other plans and switch whenever you like.'
                  : 'Choose a plan to unlock your dashboard features.'}
              </p>
              <Link to={ROUTES.PLANS}>
                <Button block>{isActive ? 'View plans' : 'Choose a plan'}</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
