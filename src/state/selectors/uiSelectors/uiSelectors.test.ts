/**
 * UI Selectors Tests
 * 
 * Unit tests for UI selectors to ensure correct data extraction from Redux state.
 * 
 * **Validates: Requirements 2.6, 13.1**
 */

import { describe, it, expect } from 'vitest';
import {
  selectTheme,
  selectSearchHistory,
  selectIsDarkMode,
} from './uiSelectors';
import type { RootState } from '../../../types/state.types';

describe('UI Selectors', () => {
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

  describe('selectTheme', () => {
    it('should return light theme when theme is light', () => {
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: [],
        },
      });

      const result = selectTheme(state);
      expect(result).toBe('light');
    });

    it('should return dark theme when theme is dark', () => {
      const state = createMockState({
        ui: {
          theme: 'dark',
          searchHistory: [],
        },
      });

      const result = selectTheme(state);
      expect(result).toBe('dark');
    });
  });

  describe('selectSearchHistory', () => {
    it('should return empty array when search history is empty', () => {
      const state = createMockState();
      const result = selectSearchHistory(state);
      expect(result).toEqual([]);
    });

    it('should return search history with single city', () => {
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: ['London'],
        },
      });

      const result = selectSearchHistory(state);
      expect(result).toEqual(['London']);
    });

    it('should return search history with multiple cities', () => {
      const cities = ['London', 'Paris', 'Tokyo', 'New York'];
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: cities,
        },
      });

      const result = selectSearchHistory(state);
      expect(result).toEqual(cities);
    });

    it('should return search history with maximum 10 cities', () => {
      const cities = [
        'London',
        'Paris',
        'Tokyo',
        'New York',
        'Berlin',
        'Madrid',
        'Rome',
        'Sydney',
        'Toronto',
        'Mumbai',
      ];
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: cities,
        },
      });

      const result = selectSearchHistory(state);
      expect(result).toEqual(cities);
      expect(result.length).toBe(10);
    });

    it('should preserve order of search history', () => {
      const cities = ['London', 'Paris', 'Tokyo'];
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: cities,
        },
      });

      const result = selectSearchHistory(state);
      expect(result[0]).toBe('London');
      expect(result[1]).toBe('Paris');
      expect(result[2]).toBe('Tokyo');
    });
  });

  describe('selectIsDarkMode', () => {
    it('should return false when theme is light', () => {
      const state = createMockState({
        ui: {
          theme: 'light',
          searchHistory: [],
        },
      });

      const result = selectIsDarkMode(state);
      expect(result).toBe(false);
    });

    it('should return true when theme is dark', () => {
      const state = createMockState({
        ui: {
          theme: 'dark',
          searchHistory: [],
        },
      });

      const result = selectIsDarkMode(state);
      expect(result).toBe(true);
    });
  });

  describe('UI Selectors Integration', () => {
    it('should work together to provide complete UI state', () => {
      const state = createMockState({
        ui: {
          theme: 'dark',
          searchHistory: ['London', 'Paris', 'Tokyo'],
        },
      });

      const theme = selectTheme(state);
      const history = selectSearchHistory(state);
      const isDarkMode = selectIsDarkMode(state);

      expect(theme).toBe('dark');
      expect(history).toEqual(['London', 'Paris', 'Tokyo']);
      expect(isDarkMode).toBe(true);
    });

    it('should correctly reflect state changes', () => {
      const initialState = createMockState({
        ui: {
          theme: 'light',
          searchHistory: ['London'],
        },
      });

      const updatedState = createMockState({
        ui: {
          theme: 'dark',
          searchHistory: ['London', 'Paris'],
        },
      });

      // Initial state
      expect(selectTheme(initialState)).toBe('light');
      expect(selectSearchHistory(initialState)).toEqual(['London']);
      expect(selectIsDarkMode(initialState)).toBe(false);

      // Updated state
      expect(selectTheme(updatedState)).toBe('dark');
      expect(selectSearchHistory(updatedState)).toEqual(['London', 'Paris']);
      expect(selectIsDarkMode(updatedState)).toBe(true);
    });
  });
});
