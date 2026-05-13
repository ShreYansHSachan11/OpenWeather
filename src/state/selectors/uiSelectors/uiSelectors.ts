/**
 * UI Selectors
 * 
 * Redux selectors for accessing UI state data.
 * Provides typed access to theme preferences and search history.
 * 
 * **Validates: Requirement 2.6**
 */

import type { RootState } from '../../types/state.types';
import type { Theme } from '../../types/state.types';

/**
 * Select theme preference
 * 
 * @param state - Root Redux state
 * @returns Current theme ('light' or 'dark')
 * 
 * **Validates: Requirement 2.6**
 */
export const selectTheme = (state: RootState): Theme => {
  return state.ui.theme;
};

/**
 * Select search history
 * 
 * @param state - Root Redux state
 * @returns Array of recently searched city names (max 10 items)
 * 
 * **Validates: Requirement 2.6**
 */
export const selectSearchHistory = (state: RootState): string[] => {
  return state.ui.searchHistory;
};

/**
 * Select dark mode status
 * 
 * @param state - Root Redux state
 * @returns True if dark mode is active, false if light mode is active
 * 
 * **Validates: Requirement 2.6**
 */
export const selectIsDarkMode = (state: RootState): boolean => {
  return state.ui.theme === 'dark';
};
