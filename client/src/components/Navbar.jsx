import Logo from './Logo.jsx';
import ThemeToggle from './ThemeToggle.jsx';
import UserMenu from './UserMenu.jsx';
import styles from './Navbar.module.css';

/** Top navigation bar. Receives a callback to toggle the mobile sidebar. */
const Navbar = ({ onMenuClick }) => (
  <header className={styles.navbar}>
    <div className={styles.left}>
      <button
        type="button"
        className={styles.menuBtn}
        onClick={onMenuClick}
        aria-label="Toggle navigation menu"
      >
        <span />
        <span />
        <span />
      </button>
      <Logo />
    </div>

    <div className={styles.right}>
      <ThemeToggle />
      <UserMenu />
    </div>
  </header>
);

export default Navbar;
