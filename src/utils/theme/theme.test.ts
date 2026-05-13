/**
 * Unit tests for theme persistence utilities
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { saveThemeToLocalStorage, loadThemeFromLocalStorage } from './theme';
import { Theme } from '../../types/state.types';

describe('Theme Persistence Utilities', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  describe('saveThemeToLocalStorage', () => {
    it('saves light theme to localStorage', () => {
      saveThemeToLocalStorage('light');
      expect(localStorage.getItem('weather-dashboard-theme')).toBe('light');
    });

    it('saves dark theme to localStorage', () => {
      saveThemeToLocalStorage('dark');
      expect(localStorage.getItem('weather-dashboard-theme')).toBe('dark');
    });

    it('overwrites existing theme value', () => {
      saveThemeToLocalStorage('light');
      saveThemeToLocalStorage('dark');
      expect(localStorage.getItem('weather-dashboard-theme')).toBe('dark');
    });

    it('handles localStorage errors gracefully', () => {
      // Mock localStorage.setItem to throw an error
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      setItemSpy.mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      // Should not throw
      expect(() => saveThemeToLocalStorage('dark')).not.toThrow();

      setItemSpy.mockRestore();
    });
  });

  describe('loadThemeFromLocalStorage', () => {
    it('loads light theme from localStorage', () => {
      localStorage.setItem('weather-dashboard-theme', 'light');
      expect(loadThemeFromLocalStorage()).toBe('light');
    });

    it('loads dark theme from localStorage', () => {
      localStorage.setItem('weather-dashboard-theme', 'dark');
      expect(loadThemeFromLocalStorage()).toBe('dark');
    });

    it('returns light as default when no theme is saved', () => {
      expect(loadThemeFromLocalStorage()).toBe('light');
    });

    it('returns light as default when invalid theme is saved', () => {
      localStorage.setItem('weather-dashboard-theme', 'invalid-theme');
      expect(loadThemeFromLocalStorage()).toBe('light');
    });

    it('returns light as default when localStorage throws error', () => {
      // Mock localStorage.getItem to throw an error
      const getItemSpy = vi.spyOn(Storage.prototype, 'getItem');
      getItemSpy.mockImplementation(() => {
        throw new Error('localStorage not available');
      });

      expect(loadThemeFromLocalStorage()).toBe('light');

      getItemSpy.mockRestore();
    });
  });

  describe('round-trip persistence', () => {
    it('preserves light theme through save and load', () => {
      const theme: Theme = 'light';
      saveThemeToLocalStorage(theme);
      expect(loadThemeFromLocalStorage()).toBe(theme);
    });

    it('preserves dark theme through save and load', () => {
      const theme: Theme = 'dark';
      saveThemeToLocalStorage(theme);
      expect(loadThemeFromLocalStorage()).toBe(theme);
    });

    it('handles multiple save and load cycles', () => {
      saveThemeToLocalStorage('light');
      expect(loadThemeFromLocalStorage()).toBe('light');

      saveThemeToLocalStorage('dark');
      expect(loadThemeFromLocalStorage()).toBe('dark');

      saveThemeToLocalStorage('light');
      expect(loadThemeFromLocalStorage()).toBe('light');
    });
  });

  /**
   * Property 8: Theme Preference Persistence Round-Trip
   * **Validates: Requirements 11.4**
   * 
   * For any theme value ('light' or 'dark'), saving the theme to localStorage
   * and then loading it SHALL return the same theme value without modification.
   */
  describe('Property 8: Theme Preference Persistence Round-Trip', () => {
    it('theme round-trip through localStorage preserves value', () => {
      fc.assert(
        fc.property(fc.constantFrom<Theme>('light', 'dark'), (theme) => {
          // Clear localStorage before each property test iteration
          localStorage.clear();
          
          // Save theme to localStorage
          saveThemeToLocalStorage(theme);
          
          // Load theme from localStorage
          const loaded = loadThemeFromLocalStorage();
          
          // Verify the loaded theme matches the saved theme
          expect(loaded).toBe(theme);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });

    it('multiple sequential round-trips preserve theme values', () => {
      fc.assert(
        fc.property(
          fc.array(fc.constantFrom<Theme>('light', 'dark'), { minLength: 1, maxLength: 10 }),
          (themes) => {
            // Clear localStorage before test
            localStorage.clear();
            
            // Test each theme in sequence
            for (const theme of themes) {
              saveThemeToLocalStorage(theme);
              const loaded = loadThemeFromLocalStorage();
              expect(loaded).toBe(theme);
            }
            
            return true;
          }
        ),
        { numRuns: 100 }
      );
    });

    it('theme persistence is idempotent', () => {
      fc.assert(
        fc.property(fc.constantFrom<Theme>('light', 'dark'), (theme) => {
          // Clear localStorage before test
          localStorage.clear();
          
          // Save the same theme multiple times
          saveThemeToLocalStorage(theme);
          saveThemeToLocalStorage(theme);
          saveThemeToLocalStorage(theme);
          
          // Load should still return the correct theme
          const loaded = loadThemeFromLocalStorage();
          expect(loaded).toBe(theme);
          
          return true;
        }),
        { numRuns: 100 }
      );
    });
  });
});
