/**
 * Weather Selectors Tests
 * 
 * Unit tests for weather selectors to ensure correct data extraction from Redux state.
 * 
 * **Validates: Requirements 2.6, 13.1**
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import {
  selectCurrentWeather,
  selectForecast,
  selectLoading,
  selectError,
  selectCachedWeather,
} from './weatherSelectors';
import type { RootState } from '../../../types/state.types';
import type { WeatherData, ForecastData, CachedWeatherData } from '../../../types/weather.types';
import { weatherStateArbitrary, uiStateArbitrary } from '../../../test/arbitraries';

describe('Weather Selectors', () => {
  // Mock weather data
  const mockWeatherData: WeatherData = {
    cityName: 'London',
    temperature: 20,
    condition: 'Cloudy',
    description: 'Partly cloudy',
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
      {
        date: '2024-01-02',
        temperature: 22,
        tempMin: 18,
        tempMax: 24,
        condition: 'Clear',
        description: 'Clear sky',
        icon: '01d',
      },
      {
        date: '2024-01-03',
        temperature: 19,
        tempMin: 16,
        tempMax: 21,
        condition: 'Clouds',
        description: 'Scattered clouds',
        icon: '03d',
      },
      {
        date: '2024-01-04',
        temperature: 17,
        tempMin: 14,
        tempMax: 19,
        condition: 'Rain',
        description: 'Moderate rain',
        icon: '10d',
      },
      {
        date: '2024-01-05',
        temperature: 21,
        tempMin: 17,
        tempMax: 23,
        condition: 'Clear',
        description: 'Clear sky',
        icon: '01d',
      },
    ],
    timestamp: Date.now(),
  };

  const mockCachedData: CachedWeatherData = {
    weather: mockWeatherData,
    forecast: mockForecastData,
    timestamp: Date.now(),
  };

  // Helper to create mock state
  const createMockState = (overrides?: Partial<RootState>): RootState => ({
    weather: {
      currentWeather: null,
      forecast: null,
      loading: false,
      error: null,
      cache: {},
    },
    ui: {
      theme: 'light',
      searchHistory: [],
    },
    ...overrides,
  });

  describe('selectCurrentWeather', () => {
    it('should return current weather data when available', () => {
      const state = createMockState({
        weather: {
          currentWeather: mockWeatherData,
          forecast: null,
          loading: false,
          error: null,
          cache: {},
        },
      });

      const result = selectCurrentWeather(state);
      expect(result).toEqual(mockWeatherData);
    });

    it('should return null when no weather data is available', () => {
      const state = createMockState();
      const result = selectCurrentWeather(state);
      expect(result).toBeNull();
    });
  });

  describe('selectForecast', () => {
    it('should return forecast data when available', () => {
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: mockForecastData,
          loading: false,
          error: null,
          cache: {},
        },
      });

      const result = selectForecast(state);
      expect(result).toEqual(mockForecastData);
    });

    it('should return null when no forecast data is available', () => {
      const state = createMockState();
      const result = selectForecast(state);
      expect(result).toBeNull();
    });
  });

  describe('selectLoading', () => {
    it('should return true when loading', () => {
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: true,
          error: null,
          cache: {},
        },
      });

      const result = selectLoading(state);
      expect(result).toBe(true);
    });

    it('should return false when not loading', () => {
      const state = createMockState();
      const result = selectLoading(state);
      expect(result).toBe(false);
    });
  });

  describe('selectError', () => {
    it('should return error message when error exists', () => {
      const errorMessage = 'City not found';
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: false,
          error: errorMessage,
          cache: {},
        },
      });

      const result = selectError(state);
      expect(result).toBe(errorMessage);
    });

    it('should return null when no error exists', () => {
      const state = createMockState();
      const result = selectError(state);
      expect(result).toBeNull();
    });
  });

  describe('selectCachedWeather', () => {
    it('should return cached data for a city when available', () => {
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: false,
          error: null,
          cache: {
            london: mockCachedData,
          },
        },
      });

      const result = selectCachedWeather(state, 'London');
      expect(result).toEqual(mockCachedData);
    });

    it('should normalize city name to lowercase', () => {
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: false,
          error: null,
          cache: {
            london: mockCachedData,
          },
        },
      });

      const result = selectCachedWeather(state, 'LONDON');
      expect(result).toEqual(mockCachedData);
    });

    it('should trim whitespace from city name', () => {
      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: false,
          error: null,
          cache: {
            london: mockCachedData,
          },
        },
      });

      const result = selectCachedWeather(state, '  London  ');
      expect(result).toEqual(mockCachedData);
    });

    it('should return undefined when cached data does not exist', () => {
      const state = createMockState();
      const result = selectCachedWeather(state, 'Paris');
      expect(result).toBeUndefined();
    });

    it('should handle multiple cached cities', () => {
      const parisCachedData: CachedWeatherData = {
        weather: { ...mockWeatherData, cityName: 'Paris' },
        forecast: { ...mockForecastData, cityName: 'Paris' },
        timestamp: Date.now(),
      };

      const state = createMockState({
        weather: {
          currentWeather: null,
          forecast: null,
          loading: false,
          error: null,
          cache: {
            london: mockCachedData,
            paris: parisCachedData,
          },
        },
      });

      const londonResult = selectCachedWeather(state, 'London');
      const parisResult = selectCachedWeather(state, 'Paris');

      expect(londonResult).toEqual(mockCachedData);
      expect(parisResult).toEqual(parisCachedData);
    });
  });

  /**
   * Property-Based Test: Redux Selectors Extract Correct Data
   * 
   * **Validates: Requirements 2.6**
   * 
   * This property test verifies that for any valid Redux state object,
   * the weather selectors correctly extract the corresponding data fields
   * (currentWeather, forecast, loading, error) without modification or loss of information.
   */
  describe('Property 2: Redux Selectors Extract Correct Data', () => {
    it('selectors extract correct data from any valid state without modification', () => {
      fc.assert(
        fc.property(
          weatherStateArbitrary(),
          uiStateArbitrary(),
          (weatherState, uiState) => {
            // Construct a valid RootState from generated weather and UI states
            const rootState: RootState = {
              weather: weatherState,
              ui: uiState,
            };

            // Test that each selector extracts the exact corresponding field
            // without any modification or loss of information
            expect(selectCurrentWeather(rootState)).toBe(weatherState.currentWeather);
            expect(selectForecast(rootState)).toBe(weatherState.forecast);
            expect(selectLoading(rootState)).toBe(weatherState.loading);
            expect(selectError(rootState)).toBe(weatherState.error);

            // Verify that selectors return the exact reference (no copying/modification)
            if (weatherState.currentWeather !== null) {
              expect(selectCurrentWeather(rootState)).toBe(weatherState.currentWeather);
            }
            if (weatherState.forecast !== null) {
              expect(selectForecast(rootState)).toBe(weatherState.forecast);
            }

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('selectCachedWeather extracts correct cached data for any city name', () => {
      fc.assert(
        fc.property(
          weatherStateArbitrary(),
          uiStateArbitrary(),
          fc.string({ minLength: 1, maxLength: 50 }),
          (weatherState, uiState, cityName) => {
            const rootState: RootState = {
              weather: weatherState,
              ui: uiState,
            };

            // Normalize the city name the same way the selector does
            const normalizedCityName = cityName.toLowerCase().trim();
            
            // Get the result from the selector
            const result = selectCachedWeather(rootState, cityName);
            
            // Verify it matches what's in the cache (or undefined if not present)
            const expectedResult = weatherState.cache[normalizedCityName];
            expect(result).toBe(expectedResult);

            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
