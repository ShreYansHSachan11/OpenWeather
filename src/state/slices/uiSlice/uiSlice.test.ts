/**
 * UI Slice Unit Tests
 * 
 * Tests for UI slice reducers and actions
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import uiReducer, { toggleTheme, setTheme, addToSearchHistory } from './uiSlice';
import type { UIState } from '../../../types/state.types';
import * as themeUtils from '../../../utils/theme/theme';

// Mock theme utilities
vi.mock('../../utils/theme', () => ({
  loadThemeFromLocalStorage: vi.fn(() => 'light'),
  saveThemeToLocalStorage: vi.fn(),
}));

describe('uiSlice', () => {
  let initialState: UIState;

  beforeEach(() => {
    initialState = {
      theme: 'light',
      searchHistory: [],
    };
    vi.clearAllMocks();
  });

  describe('initial state', () => {
    it('should have light theme as default', () => {
      expect(initialState.theme).toBe('light');
    });

    it('should have empty search history initially', () => {
      expect(initialState.searchHistory).toEqual([]);
    });
  });

  describe('toggleTheme', () => {
    it('should toggle from light to dark', () => {
      const state = uiReducer(initialState, toggleTheme());
      expect(state.theme).toBe('dark');
    });

    it('should toggle from dark to light', () => {
      const darkState: UIState = { ...initialState, theme: 'dark' };
      const state = uiReducer(darkState, toggleTheme());
      expect(state.theme).toBe('light');
    });

    it('should persist theme to localStorage when toggling', () => {
      uiReducer(initialState, toggleTheme());
      expect(themeUtils.saveThemeToLocalStorage).toHaveBeenCalledWith('dark');
    });
  });

  describe('setTheme', () => {
    it('should set theme to dark', () => {
      const state = uiReducer(initialState, setTheme('dark'));
      expect(state.theme).toBe('dark');
    });

    it('should set theme to light', () => {
      const darkState: UIState = { ...initialState, theme: 'dark' };
      const state = uiReducer(darkState, setTheme('light'));
      expect(state.theme).toBe('light');
    });

    it('should persist theme to localStorage when setting', () => {
      uiReducer(initialState, setTheme('dark'));
      expect(themeUtils.saveThemeToLocalStorage).toHaveBeenCalledWith('dark');
    });
  });

  describe('addToSearchHistory', () => {
    it('should add city to empty search history', () => {
      const state = uiReducer(initialState, addToSearchHistory('London'));
      expect(state.searchHistory).toEqual(['London']);
    });

    it('should add city to the beginning of search history', () => {
      const stateWithHistory: UIState = {
        ...initialState,
        searchHistory: ['Paris', 'Tokyo'],
      };
      const state = uiReducer(stateWithHistory, addToSearchHistory('London'));
      expect(state.searchHistory).toEqual(['London', 'Paris', 'Tokyo']);
    });

    it('should trim whitespace from city name', () => {
      const state = uiReducer(initialState, addToSearchHistory('  London  '));
      expect(state.searchHistory).toEqual(['London']);
    });

    it('should remove duplicate city and move it to front', () => {
      const stateWithHistory: UIState = {
        ...initialState,
        searchHistory: ['Paris', 'London', 'Tokyo'],
      };
      const state = uiReducer(stateWithHistory, addToSearchHistory('London'));
      expect(state.searchHistory).toEqual(['London', 'Paris', 'Tokyo']);
    });

    it('should maintain 10-item limit by removing oldest entry', () => {
      const stateWithHistory: UIState = {
        ...initialState,
        searchHistory: [
          'City1',
          'City2',
          'City3',
          'City4',
          'City5',
          'City6',
          'City7',
          'City8',
          'City9',
          'City10',
        ],
      };
      const state = uiReducer(stateWithHistory, addToSearchHistory('City11'));
      expect(state.searchHistory).toHaveLength(10);
      expect(state.searchHistory[0]).toBe('City11');
      expect(state.searchHistory).not.toContain('City10');
    });

    it('should not exceed 10 items when adding multiple cities', () => {
      let state = initialState;
      
      // Add 15 cities
      for (let i = 1; i <= 15; i++) {
        state = uiReducer(state, addToSearchHistory(`City${i}`));
      }
      
      expect(state.searchHistory).toHaveLength(10);
      expect(state.searchHistory[0]).toBe('City15');
      expect(state.searchHistory[9]).toBe('City6');
    });

    it('should handle adding the same city multiple times', () => {
      let state = initialState;
      
      state = uiReducer(state, addToSearchHistory('London'));
      state = uiReducer(state, addToSearchHistory('Paris'));
      state = uiReducer(state, addToSearchHistory('London'));
      
      expect(state.searchHistory).toEqual(['London', 'Paris']);
    });
  });

  describe('edge cases', () => {
    it('should handle empty string in search history', () => {
      const state = uiReducer(initialState, addToSearchHistory(''));
      expect(state.searchHistory).toEqual(['']);
    });

    it('should handle whitespace-only string in search history', () => {
      const state = uiReducer(initialState, addToSearchHistory('   '));
      expect(state.searchHistory).toEqual(['']);
    });
  });

  describe('Property-Based Tests', () => {
    /**
     * Property 6: Adding City to Search History Includes It
     * 
     * **Validates: Requirements 10.2**
     * 
     * For any search history state and any valid city name, dispatching an action 
     * to add the city SHALL result in a new state where the city name appears 
     * in the search history list.
     */
    it('Property 6: adding city to search history always includes it', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
          fc.string({ minLength: 1, maxLength: 50 }),
          (history, cityName) => {
            // Arrange: Create initial state with given search history
            const state: UIState = {
              theme: 'light',
              searchHistory: history,
            };

            // Act: Add city to search history
            const newState = uiReducer(state, addToSearchHistory(cityName));

            // Assert: The city name should be in the search history
            // Note: The city name is trimmed by the reducer
            const trimmedCityName = cityName.trim();
            expect(newState.searchHistory).toContain(trimmedCityName);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7: Search History Maintains Length Invariant
     * 
     * **Validates: Requirements 10.3**
     * 
     * For any sequence of city additions to the search history, the resulting 
     * search history array SHALL never exceed 10 items, with the oldest entries 
     * removed when the limit is reached.
     */
    it('Property 7: search history never exceeds 10 items regardless of additions', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 50 }),
          (cities) => {
            // Arrange: Start with empty search history
            let state: UIState = {
              theme: 'light',
              searchHistory: [],
            };

            // Act: Add all cities sequentially
            cities.forEach((city) => {
              state = uiReducer(state, addToSearchHistory(city));
            });

            // Assert: Search history should never exceed 10 items
            expect(state.searchHistory.length).toBeLessThanOrEqual(10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7 (Extended): Search history maintains length invariant with initial state
     * 
     * **Validates: Requirements 10.3**
     * 
     * Tests that the 10-item limit is maintained even when starting with 
     * an existing search history.
     */
    it('Property 7: search history never exceeds 10 items with initial history', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 1, maxLength: 50 }),
          (initialHistory, citiesToAdd) => {
            // Arrange: Start with an initial search history (up to 10 items)
            let state: UIState = {
              theme: 'light',
              searchHistory: initialHistory,
            };

            // Act: Add all cities sequentially
            citiesToAdd.forEach((city) => {
              state = uiReducer(state, addToSearchHistory(city));
            });

            // Assert: Search history should never exceed 10 items
            expect(state.searchHistory.length).toBeLessThanOrEqual(10);
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    /**
     * Property 7 (Oldest Removal): Oldest entries are removed when limit is reached
     * 
     * **Validates: Requirements 10.3**
     * 
     * Tests that when the 10-item limit is reached, the oldest entries 
     * are removed to make room for new entries. The most recent unique city
     * should always be at the front of the history.
     */
    it('Property 7: oldest entries are removed when exceeding 10 items', () => {
      fc.assert(
        fc.property(
          fc.array(fc.string({ minLength: 1, maxLength: 50 }), { minLength: 11, maxLength: 30 }),
          (cities) => {
            // Arrange: Start with empty search history
            let state: UIState = {
              theme: 'light',
              searchHistory: [],
            };

            // Act: Add all cities sequentially
            cities.forEach((city) => {
              state = uiReducer(state, addToSearchHistory(city));
            });

            // Assert: Search history should have at most 10 items
            expect(state.searchHistory.length).toBeLessThanOrEqual(10);
            
            // Assert: The most recent city (after trimming) should be at the front
            const lastCity = cities[cities.length - 1].trim();
            if (lastCity.length > 0) {
              expect(state.searchHistory[0]).toBe(lastCity);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });
  });
});
