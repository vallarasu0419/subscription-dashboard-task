import StatusBadge from './StatusBadge.jsx';
import { formatPrice, formatDate, daysRemaining } from '../utils/format.js';
import { SUBSCRIPTION_STATUS } from '../utils/constants.js';
import styles from './SubscriptionStatusCard.module.css';

/** Hero card on the dashboard summarising the current subscription. */
const SubscriptionStatusCard = ({ subscription }) => {
  const plan = subscription?.plan;
  const status = subscription?.status || 'none';
  const isActive = status === SUBSCRIPTION_STATUS.ACTIVE;
  const remaining = isActive ? daysRemaining(subscription.endDate) : 0;

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <div>
          <p className={styles.eyebrow}>Current plan</p>
          <h2 className={styles.planName}>{plan?.name || 'No active plan'}</h2>
        </div>
        <StatusBadge status={status} />
      </div>

      {plan ? (
        <>
          <p className={styles.price}>
            {formatPrice(plan.price)}
            {plan.price > 0 && (
              <span className={styles.cycle}> / {plan.duration} days</span>
            )}
          </p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Started</span>
              <span className={styles.metaValue}>{formatDate(subscription.startDate)}</span>
            </div>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>
                {isActive ? 'Renews / expires' : 'Ended'}
              </span>
              <span className={styles.metaValue}>{formatDate(subscription.endDate)}</span>
            </div>
            {isActive && (
              <div className={styles.metaItem}>
                <span className={styles.metaLabel}>Days remaining</span>
                <span className={styles.metaValue}>{remaining}</span>
              </div>
            )}
          </div>
        </>
      ) : (
        <p className={styles.empty}>
          You haven&apos;t subscribed to a plan yet. Browse plans to get started.
        </p>
      )}
    </section>
  );
};

export default SubscriptionStatusCard;
