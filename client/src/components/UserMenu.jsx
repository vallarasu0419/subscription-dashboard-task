import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth.js';
import { getInitials, capitalize } from '../utils/format.js';
import styles from './UserMenu.module.css';

/** Avatar button that opens a dropdown with profile info and logout. */
const UserMenu = () => {
  const { user, signOut } = useAuth();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close on outside click or Escape.
  useEffect(() => {
    const handleClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    const handleKey = (event) => {
      if (event.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, []);

  if (!user) return null;

  return (
    <div className={styles.wrapper} ref={menuRef}>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <span className={styles.avatar}>{getInitials(user.name)}</span>
        <span className={styles.meta}>
          <span className={styles.name}>{user.name}</span>
          <span className={styles.role}>{capitalize(user.role)}</span>
        </span>
        <span className={styles.chevron} aria-hidden="true">▾</span>
      </button>

      {open && (
        <div className={styles.dropdown} role="menu">
          <div className={styles.header}>
            <span className={styles.avatarLg}>{getInitials(user.name)}</span>
            <div>
              <p className={styles.dropName}>{user.name}</p>
              <p className={styles.email}>{user.email}</p>
            </div>
          </div>
          <div className={styles.divider} />
          <button
            type="button"
            className={styles.logout}
            onClick={signOut}
            role="menuitem"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
