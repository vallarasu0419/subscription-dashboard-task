import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectTheme, toggleTheme } from '../features/theme/themeSlice.js';

/** Reads the theme from the store and reflects it on <html data-theme>. */
export const useTheme = () => {
  const mode = useSelector(selectTheme);
  const dispatch = useDispatch();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', mode);
  }, [mode]);

  return { mode, toggle: () => dispatch(toggleTheme()) };
};
