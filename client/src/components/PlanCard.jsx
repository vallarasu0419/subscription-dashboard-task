import Button from './Button.jsx';
import { formatPrice } from '../utils/format.js';
import styles from './PlanCard.module.css';

/**
 * Reusable plan card.
 * @param plan        the plan object
 * @param isCurrent   true if this is the user's active plan
 * @param isLoading   true while a subscribe request for this plan is in flight
 * @param featured    visually highlight (e.g. most popular)
 * @param onSubscribe callback invoked with the plan id
 */
const PlanCard = ({ plan, isCurrent, isLoading, featured, onSubscribe }) => (
  <article className={`${styles.card} ${featured ? styles.featured : ''}`}>
    {featured && <span className={styles.ribbon}>Most popular</span>}

    <header className={styles.header}>
      <h3 className={styles.name}>{plan.name}</h3>
      <p className={styles.price}>
        <span className={styles.amount}>{formatPrice(plan.price)}</span>
        {plan.price > 0 && <span className={styles.period}>/ {plan.duration} days</span>}
      </p>
    </header>

    <ul className={styles.features}>
      {plan.features.map((feature) => (
        <li key={feature} className={styles.feature}>
          <span className={styles.check} aria-hidden="true">✓</span>
          {feature}
        </li>
      ))}
    </ul>

    <Button
      variant={isCurrent ? 'outline' : 'primary'}
      block
      disabled={isCurrent}
      loading={isLoading}
      onClick={() => onSubscribe(plan.id)}
    >
      {isCurrent ? 'Current plan' : 'Choose plan'}
    </Button>
  </article>
);

export default PlanCard;
