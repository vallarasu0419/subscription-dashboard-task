import { useTheme } from '../hooks/useTheme.js';
import styles from './ThemeToggle.module.css';

/** Light/dark theme switch (bonus feature). */
const ThemeToggle = () => {
  const { mode, toggle } = useTheme();
  const isDark = mode === 'dark';

  return (
    <button
      type="button"
      className={styles.toggle}
      onClick={toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} theme`}
      title={`Switch to ${isDark ? 'light' : 'dark'} theme`}
    >
      <span className={styles.icon}>{isDark ? '☾' : '☀'}</span>
    </button>
  );
};

export default ThemeToggle;
