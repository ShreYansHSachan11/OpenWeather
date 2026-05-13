/**
 * UI Slice
 * 
 * Redux Toolkit slice for managing UI state including theme preferences and search history.
 * Implements theme persistence via localStorage and search history with 10-item limit.
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4**
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { UIState } from '../../../types/state.types';
import { loadThemeFromLocalStorage, saveThemeToLocalStorage } from '../../../utils/theme/theme';

/**
 * Initial state for UI slice
 * Loads theme from localStorage on initialization
 * 
 * **Validates: Requirements 10.1, 11.1, 11.4**
 */
const initialState: UIState = {
  theme: loadThemeFromLocalStorage(),
  searchHistory: [],
};

/**
 * UI slice
 * 
 * Contains reducers for theme management and search history.
 * 
 * **Validates: Requirements 10.1, 10.2, 10.3, 11.1, 11.2, 11.3, 11.4**
 */
const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    /**
     * Toggle theme between light and dark
     * Persists the new theme to localStorage
     * 
     * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
     */
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      state.theme = newTheme;
      saveThemeToLocalStorage(newTheme);
    },
    
    /**
     * Set theme to a specific value
     * Persists the theme to localStorage
     * 
     * @param action - Action with theme payload ('light' or 'dark')
     * 
     * **Validates: Requirements 11.1, 11.2, 11.3, 11.4**
     */
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
      saveThemeToLocalStorage(action.payload);
    },
    
    /**
     * Add city to search history
     * Maintains a maximum of 10 items, removing oldest entries when limit is reached
     * Prevents duplicate entries by moving existing city to the front
     * 
     * @param action - Action with city name payload
     * 
     * **Validates: Requirements 10.2, 10.3**
     */
    addToSearchHistory: (state, action: PayloadAction<string>) => {
      const cityName = action.payload.trim();
      
      // Remove city if it already exists in history
      const existingIndex = state.searchHistory.indexOf(cityName);
      if (existingIndex !== -1) {
        state.searchHistory.splice(existingIndex, 1);
      }
      
      // Add city to the beginning of the array
      state.searchHistory.unshift(cityName);
      
      // Maintain 10-item limit by removing oldest entries
      if (state.searchHistory.length > 10) {
        state.searchHistory = state.searchHistory.slice(0, 10);
      }
    },
  },
});

// Export actions
export const {
  toggleTheme,
  setTheme,
  addToSearchHistory,
} = uiSlice.actions;

// Export reducer
export default uiSlice.reducer;
