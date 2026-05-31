import Button from './Button.jsx';
import styles from './EmptyState.module.css';

/** Error panel with an optional retry handler. */
const ErrorState = ({ message = 'Something went wrong.', onRetry }) => (
  <div className={styles.empty}>
    <div className={styles.icon} aria-hidden="true">⚠</div>
    <h3 className={styles.title}>We hit a snag</h3>
    <p className={styles.desc}>{message}</p>
    {onRetry && (
      <div className={styles.action}>
        <Button variant="outline" onClick={onRetry}>Try again</Button>
      </div>
    )}
  </div>
);

export default ErrorState;
