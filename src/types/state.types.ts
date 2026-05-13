/**
 * Redux State Types
 * These interfaces define the structure of the Redux store
 */

import { WeatherData, ForecastData, CachedWeatherData } from './weather.types';

/**
 * Weather slice state
 * Manages weather data, forecast data, loading states, and errors
 */
export interface WeatherState {
  currentWeather: WeatherData | null;
  forecast: ForecastData | null;
  loading: boolean;
  error: string | null;
  cache: {
    [cityName: string]: CachedWeatherData;
  };
}

/**
 * UI slice state
 * Manages theme preference and search history
 */
export interface UIState {
  theme: 'light' | 'dark';
  searchHistory: string[]; // Max 10 entries
}

/**
 * Root Redux state
 * Combines all slice states
 */
export interface RootState {
  weather: WeatherState;
  ui: UIState;
}

/**
 * Theme type
 */
export type Theme = 'light' | 'dark';
