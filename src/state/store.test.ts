

import { describe, it, expect } from 'vitest';
import { store, useAppDispatch, useAppSelector } from './store';
import { setCurrentWeather } from './slices/weatherSlice/weatherSlice';
import { setTheme } from './slices/uiSlice/uiSlice';
import type { WeatherData } from '../types/weather.types';

describe('Redux Store Configuration', () => {
  describe('Store Structure', () => {
    it('should have weather and ui slices', () => {
      const state = store.getState();
      
      expect(state).toHaveProperty('weather');
      expect(state).toHaveProperty('ui');
    });
    
    it('should have correct initial state for weather slice', () => {
      const state = store.getState();
      
      expect(state.weather.currentWeather).toBeNull();
      expect(state.weather.forecast).toBeNull();
      expect(state.weather.loading).toBe(false);
      expect(state.weather.error).toBeNull();
      expect(state.weather.cache).toEqual({});
    });
    
    it('should have correct initial state for ui slice', () => {
      const state = store.getState();
      
      expect(state.ui.theme).toMatch(/^(light|dark)$/);
      expect(state.ui.searchHistory).toEqual([]);
    });
  });
  
  describe('Store Dispatch', () => {
    it('should dispatch weather actions', () => {
      const mockWeather: WeatherData = {
        cityName: 'London',
        temperature: 20,
        condition: 'Cloudy',
        description: 'Overcast clouds',
        humidity: 65,
        windSpeed: 15,
        icon: '04d',
        timestamp: Date.now(),
      };
      
      store.dispatch(setCurrentWeather(mockWeather));
      
      const state = store.getState();
      expect(state.weather.currentWeather).toEqual(mockWeather);
    });
    
    it('should dispatch ui actions', () => {
      store.dispatch(setTheme('dark'));
      
      const state = store.getState();
      expect(state.ui.theme).toBe('dark');
    });
  });
  
  describe('Typed Hooks', () => {
    it('should export useAppDispatch hook', () => {
      expect(useAppDispatch).toBeDefined();
      expect(typeof useAppDispatch).toBe('function');
    });
    
    it('should export useAppSelector hook', () => {
      expect(useAppSelector).toBeDefined();
      expect(typeof useAppSelector).toBe('function');
    });
  });
  
  describe('State Updates', () => {
    it('should update state when actions are dispatched', () => {
      const initialState = store.getState();
      
      store.dispatch(setTheme('light'));
      
      const updatedState = store.getState();
      expect(updatedState.ui.theme).toBe('light');
      expect(updatedState).not.toBe(initialState); // State should be immutable
    });
    
    it('should maintain state immutability', () => {
      const stateBefore = store.getState();
      const weatherBefore = stateBefore.weather;
      
      const mockWeather: WeatherData = {
        cityName: 'Paris',
        temperature: 18,
        condition: 'Clear',
        description: 'Clear sky',
        humidity: 55,
        windSpeed: 10,
        icon: '01d',
        timestamp: Date.now(),
      };
      
      store.dispatch(setCurrentWeather(mockWeather));
      
      const stateAfter = store.getState();
      const weatherAfter = stateAfter.weather;
      
      // State objects should be different (immutability)
      expect(weatherAfter).not.toBe(weatherBefore);
      expect(stateAfter).not.toBe(stateBefore);
    });
  });
  
  describe('Multiple Slice Interaction', () => {
    it('should handle actions from different slices independently', () => {
      const mockWeather: WeatherData = {
        cityName: 'Tokyo',
        temperature: 25,
        condition: 'Sunny',
        description: 'Clear sky',
        humidity: 60,
        windSpeed: 8,
        icon: '01d',
        timestamp: Date.now(),
      };
      
      // Dispatch weather action
      store.dispatch(setCurrentWeather(mockWeather));
      
      // Dispatch UI action
      store.dispatch(setTheme('dark'));
      
      const state = store.getState();
      
      // Both slices should be updated correctly
      expect(state.weather.currentWeather?.cityName).toBe('Tokyo');
      expect(state.ui.theme).toBe('dark');
    });
  });
});
