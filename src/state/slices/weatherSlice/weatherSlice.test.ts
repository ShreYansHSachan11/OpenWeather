/**
 * Weather Slice Tests
 * 
 * Unit tests for weather slice reducers, actions, and async thunks
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as fc from 'fast-check';
import weatherReducer, {
  setCurrentWeather,
  setForecast,
  setLoading,
  setError,
  clearError,
  searchWeather,
  refreshWeather,
} from './weatherSlice';
import type { WeatherState } from '../../../types/state.types';
import type { WeatherData, ForecastData } from '../../../types/weather.types';

// Mock the weather API
vi.mock('../../../services/weatherApi');
vi.mock('../../../utils/cache');

describe('weatherSlice', () => {
  const initialState: WeatherState = {
    currentWeather: null,
    forecast: null,
    loading: false,
    error: null,
    cache: {},
  };

  const mockWeatherData: WeatherData = {
    cityName: 'London',
    temperature: 20,
    condition: 'Cloudy',
    description: 'Overcast clouds',
    humidity: 65,
    windSpeed: 15,
    icon: '04d',
    timestamp: Date.now(),
  };

  const mockForecastData: ForecastData = {
    cityName: 'London',
    forecast: [
      {
        date: '2024-01-01',
        temperature: 18,
        tempMin: 15,
        tempMax: 20,
        condition: 'Rain',
        description: 'Light rain',
        icon: '10d',
      },
    ],
    timestamp: Date.now(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('reducers', () => {
    it('should return initial state', () => {
      expect(weatherReducer(undefined, { type: 'unknown' })).toEqual(initialState);
    });

    it('should handle setCurrentWeather', () => {
      const actual = weatherReducer(initialState, setCurrentWeather(mockWeatherData));
      expect(actual.currentWeather).toEqual(mockWeatherData);
    });

    it('should handle setForecast', () => {
      const actual = weatherReducer(initialState, setForecast(mockForecastData));
      expect(actual.forecast).toEqual(mockForecastData);
    });

    it('should handle setLoading', () => {
      const actual = weatherReducer(initialState, setLoading(true));
      expect(actual.loading).toBe(true);
    });

    it('should handle setError', () => {
      const errorMessage = 'Test error';
      const actual = weatherReducer(initialState, setError(errorMessage));
      expect(actual.error).toBe(errorMessage);
    });

    it('should handle clearError', () => {
      const stateWithError = { ...initialState, error: 'Some error' };
      const actual = weatherReducer(stateWithError, clearError());
      expect(actual.error).toBeNull();
    });
  });

  describe('searchWeather thunk', () => {
    it('should set loading to true when pending', () => {
      const action = { type: searchWeather.pending.type };
      const state = weatherReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle successful weather fetch', () => {
      const action = {
        type: searchWeather.fulfilled.type,
        payload: {
          weather: mockWeatherData,
          forecast: mockForecastData,
          fromCache: false,
        },
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.currentWeather).toEqual(mockWeatherData);
      expect(state.forecast).toEqual(mockForecastData);
      expect(state.error).toBeNull();
      expect(state.cache['london']).toBeDefined();
    });

    it('should not update cache when data is from cache', () => {
      const action = {
        type: searchWeather.fulfilled.type,
        payload: {
          weather: mockWeatherData,
          forecast: mockForecastData,
          fromCache: true,
        },
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.currentWeather).toEqual(mockWeatherData);
      expect(state.forecast).toEqual(mockForecastData);
      expect(Object.keys(state.cache).length).toBe(0);
    });

    it('should handle fetch error', () => {
      const errorMessage = 'City not found';
      const action = {
        type: searchWeather.rejected.type,
        payload: errorMessage,
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('refreshWeather thunk', () => {
    it('should set loading to true when pending', () => {
      const action = { type: refreshWeather.pending.type };
      const state = weatherReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle successful weather refresh', () => {
      const action = {
        type: refreshWeather.fulfilled.type,
        payload: {
          weather: mockWeatherData,
          forecast: mockForecastData,
          fromCache: false,
        },
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.currentWeather).toEqual(mockWeatherData);
      expect(state.forecast).toEqual(mockForecastData);
      expect(state.error).toBeNull();
      expect(state.cache['london']).toBeDefined();
    });

    it('should handle refresh error', () => {
      const errorMessage = 'Network error';
      const action = {
        type: refreshWeather.rejected.type,
        payload: errorMessage,
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.loading).toBe(false);
      expect(state.error).toBe(errorMessage);
    });
  });

  describe('cache behavior', () => {
    it('should normalize city names in cache', () => {
      const action = {
        type: searchWeather.fulfilled.type,
        payload: {
          weather: { ...mockWeatherData, cityName: 'London' },
          forecast: mockForecastData,
          fromCache: false,
        },
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.cache['london']).toBeDefined();
      expect(state.cache['London']).toBeUndefined();
    });

    it('should store timestamp with cached data', () => {
      const now = Date.now();
      vi.spyOn(Date, 'now').mockReturnValue(now);
      
      const action = {
        type: searchWeather.fulfilled.type,
        payload: {
          weather: mockWeatherData,
          forecast: mockForecastData,
          fromCache: false,
        },
      };
      const state = weatherReducer(initialState, action);
      
      expect(state.cache['london'].timestamp).toBe(now);
    });
  });

  describe('error clearing', () => {
    it('should clear error when starting new search', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: searchWeather.pending.type };
      const state = weatherReducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });

    it('should clear error when starting refresh', () => {
      const stateWithError = { ...initialState, error: 'Previous error' };
      const action = { type: refreshWeather.pending.type };
      const state = weatherReducer(stateWithError, action);
      
      expect(state.error).toBeNull();
    });
  });

  /**
   * Property 5: Search Action Clears Previous Errors
   * 
   * **Validates: Requirements 6.5**
   * 
   * For any Redux state containing an error message, dispatching a search action 
   * SHALL result in a new state where the error field is null or cleared.
   */
  describe('Property 5: Search Action Clears Previous Errors', () => {
    it('search action clears previous error state for any error message', () => {
      fc.assert(
        fc.property(fc.string(), (errorMessage) => {
          // Create a state with an error
          const stateWithError: WeatherState = { 
            ...initialState, 
            error: errorMessage 
          };
          
          // Dispatch searchWeather.pending action
          const newState = weatherReducer(stateWithError, { 
            type: searchWeather.pending.type 
          });
          
          // The error should be cleared (null)
          expect(newState.error).toBeNull();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('refresh action clears previous error state for any error message', () => {
      fc.assert(
        fc.property(fc.string(), (errorMessage) => {
          // Create a state with an error
          const stateWithError: WeatherState = { 
            ...initialState, 
            error: errorMessage 
          };
          
          // Dispatch refreshWeather.pending action
          const newState = weatherReducer(stateWithError, { 
            type: refreshWeather.pending.type 
          });
          
          // The error should be cleared (null)
          expect(newState.error).toBeNull();
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
