import React, { useEffect } from 'react';
import { useAppSelector, useAppDispatch } from '../../state/store';
import { selectTheme } from '../../state/selectors/uiSelectors';
import { setTheme } from '../../state/slices/uiSlice';
import { saveThemeToLocalStorage } from '../../utils/theme';

/**
 * ThemeProvider Component Props
 */
interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider Component
 * Manages theme state and applies theme class to root element
 * Persists theme changes to localStorage
 * Requirements: 11.2, 11.3, 11.4
 */
const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useAppSelector(selectTheme);
  const dispatch = useAppDispatch();

  // Apply theme to document root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveThemeToLocalStorage(theme);
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
