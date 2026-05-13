/**
 * Weather Selectors
 * 
 * Redux selectors for accessing weather state data.
 * Provides typed access to weather data, forecast, loading states, errors, and cache.
 * 
 * **Validates: Requirement 2.6**
 */

import type { RootState } from '../../types/state.types';
import type { WeatherData, ForecastData, CachedWeatherData } from '../../types/weather.types';

/**
 * Select current weather data
 * 
 * @param state - Root Redux state
 * @returns Current weather data or null if not available
 * 
 * **Validates: Requirement 2.6**
 */
export const selectCurrentWeather = (state: RootState): WeatherData | null => {
  return state.weather.currentWeather;
};

/**
 * Select forecast data
 * 
 * @param state - Root Redux state
 * @returns Forecast data or null if not available
 * 
 * **Validates: Requirement 2.6**
 */
export const selectForecast = (state: RootState): ForecastData | null => {
  return state.weather.forecast;
};

/**
 * Select loading state
 * 
 * @param state - Root Redux state
 * @returns True if API request is in progress, false otherwise
 * 
 * **Validates: Requirement 2.6**
 */
export const selectLoading = (state: RootState): boolean => {
  return state.weather.loading;
};

/**
 * Select error message
 * 
 * @param state - Root Redux state
 * @returns Error message string or null if no error
 * 
 * **Validates: Requirement 2.6**
 */
export const selectError = (state: RootState): string | null => {
  return state.weather.error;
};

/**
 * Select cached weather data for a specific city
 * 
 * @param state - Root Redux state
 * @param cityName - Name of the city to retrieve cached data for
 * @returns Cached weather data or undefined if not cached
 * 
 * **Validates: Requirement 2.6**
 */
export const selectCachedWeather = (
  state: RootState,
  cityName: string
): CachedWeatherData | undefined => {
  const normalizedCityName = cityName.toLowerCase().trim();
  return state.weather.cache[normalizedCityName];
};
