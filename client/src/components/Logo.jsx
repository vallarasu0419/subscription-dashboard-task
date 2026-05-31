import { Link } from 'react-router-dom';
import styles from './Logo.module.css';

/** App wordmark used in the navbar and auth pages. */
const Logo = ({ to = '/dashboard' }) => (
  <Link to={to} className={styles.logo} aria-label="SubHub home">
    <span className={styles.mark} aria-hidden="true">S</span>
    <span className={styles.word}>SubHub</span>
  </Link>
);

export default Logo;
