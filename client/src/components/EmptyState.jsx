import styles from './EmptyState.module.css';

/** Friendly empty state with an optional action slot. */
const EmptyState = ({ icon = '◔', title, description, action }) => (
  <div className={styles.empty}>
    <div className={styles.icon} aria-hidden="true">{icon}</div>
    <h3 className={styles.title}>{title}</h3>
    {description && <p className={styles.desc}>{description}</p>}
    {action && <div className={styles.action}>{action}</div>}
  </div>
);

export default EmptyState;
