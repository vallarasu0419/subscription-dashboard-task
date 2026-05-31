import { NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.js';
import { ROUTES, ROLES } from '../utils/constants.js';
import styles from './Sidebar.module.css';

/** Navigation items. `adminOnly` items are filtered for non-admins. */
const NAV_ITEMS = [
  { to: ROUTES.DASHBOARD, label: 'Dashboard', icon: '◫' },
  { to: ROUTES.PLANS, label: 'Plans', icon: '◇' },
  { to: ROUTES.ADMIN_SUBSCRIPTIONS, label: 'Subscriptions', icon: '☰', adminOnly: true },
];

const Sidebar = ({ open, onClose }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === ROLES.ADMIN;

  const items = NAV_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  return (
    <>
      {/* Mobile overlay */}
      <div
        className={`${styles.overlay} ${open ? styles.overlayOpen : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}>
        <nav className={styles.nav} aria-label="Primary">
          {items.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `${styles.link} ${isActive ? styles.active : ''}`
              }
            >
              <span className={styles.icon} aria-hidden="true">{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className={styles.footer}>
          <p className={styles.tip}>
            {isAdmin
              ? 'You have administrator access.'
              : 'Manage your plan anytime from Plans.'}
          </p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
