/**
 * State Management Barrel Export
 * 
 * Exports store, hooks, slices, and selectors for easy importing.
 */

// Store and hooks
export { store, useAppDispatch, useAppSelector } from './store';
export type { AppDispatch } from './store';

// Weather slice
export {
  searchWeather,
  refreshWeather,
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
  clearError,
} from './slices/weatherSlice/weatherSlice';

// UI slice
export {
  toggleTheme,
  setTheme,
  addToSearchHistory,
} from './slices/uiSlice/uiSlice';

// Selectors
export {
  selectCurrentWeather,
  selectForecast,
  selectLoading,
  selectError,
  selectCachedWeather,
} from './selectors/weatherSelectors';

export {
  selectTheme,
  selectSearchHistory,
  selectIsDarkMode,
} from './selectors/uiSelectors';
