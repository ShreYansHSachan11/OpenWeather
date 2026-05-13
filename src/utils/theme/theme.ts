/**
 * Theme Persistence Utilities
 * Functions to save and load theme preferences from localStorage
 */

import { Theme } from '../../types/state.types';

const THEME_STORAGE_KEY = 'weather-dashboard-theme';

/**
 * Save theme preference to localStorage
 * @param theme - The theme to save ('light' or 'dark')
 */
export function saveThemeToLocalStorage(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (error) {
    // Handle localStorage errors (e.g., quota exceeded, private browsing)
    console.error('Failed to save theme to localStorage:', error);
  }
}

/**
 * Load theme preference from localStorage
 * @returns The saved theme, or 'light' as default if not found
 */
export function loadThemeFromLocalStorage(): Theme {
  try {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    
    // Validate that the saved value is a valid theme
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme;
    }
    
    // Return default theme if invalid or not found
    return 'light';
  } catch (error) {
    // Handle localStorage errors (e.g., not available in some environments)
    console.error('Failed to load theme from localStorage:', error);
    return 'light';
  }
}
