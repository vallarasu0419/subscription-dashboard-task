import Logo from '../components/Logo.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';
import styles from './AuthLayout.module.css';

/** Split-screen layout shared by the Login and Register pages. */
const AuthLayout = ({ title, subtitle, children, footer }) => (
  <div className={styles.wrapper}>
    {/* Brand / marketing panel */}
    <aside className={styles.brand}>
      <div className={styles.brandTop}>
        <Logo to="/login" />
      </div>
      <div className={styles.brandBody}>
        <h1 className={styles.brandHeading}>
          Subscriptions, beautifully managed.
        </h1>
        <p className={styles.brandText}>
          SubHub gives your team a clean, fast home for plans, billing status
          and member access — all in one calm dashboard.
        </p>
        <ul className={styles.brandList}>
          <li>Role-based access for admins and members</li>
          <li>Live subscription status at a glance</li>
          <li>Upgrade or switch plans in a single click</li>
        </ul>
      </div>
      <p className={styles.brandFootnote}>© {new Date().getFullYear()} SubHub</p>
    </aside>

    {/* Form panel */}
    <main className={styles.formPanel}>
      <div className={styles.toggleWrap}>
        <ThemeToggle />
      </div>
      <div className={styles.formInner}>
        <div className={styles.mobileLogo}>
          <Logo to="/login" />
        </div>
        <header className={styles.formHeader}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.subtitle}>{subtitle}</p>
        </header>
        {children}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </main>
  </div>
);

export default AuthLayout;
