/**
 * Test utilities for React Testing Library
 * Provides helper functions for testing React components with Redux
 */

import { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import type { RootState } from '@/types';

// Import slices (will be created in later tasks)
// import weatherReducer from '@/state/slices/weatherSlice';
// import uiReducer from '@/state/slices/uiSlice';

/**
 * Creates a mock Redux store for testing
 */
export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      // weather: weatherReducer,
      // ui: uiReducer,
    },
    preloadedState,
  });
}

export type AppStore = ReturnType<typeof setupStore>;

/**
 * Custom render function that wraps components with Redux Provider
 */
interface ExtendedRenderOptions extends Omit<RenderOptions, 'queries'> {
  preloadedState?: Partial<RootState>;
  store?: AppStore;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    preloadedState,
    store = setupStore(preloadedState),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return { store, ...render(ui, { wrapper: Wrapper, ...renderOptions }) };
}

/**
 * Mock data generators for tests
 */
export const mockWeatherData = {
  cityName: 'London',
  temperature: 20,
  condition: 'Clouds',
  description: 'scattered clouds',
  humidity: 65,
  windSpeed: 15,
  icon: '04d',
  timestamp: Date.now(),
};

export const mockForecastData = {
  cityName: 'London',
  forecast: [
    {
      date: '2024-01-01T12:00:00Z',
      temperature: 18,
      tempMin: 15,
      tempMax: 20,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
    {
      date: '2024-01-02T12:00:00Z',
      temperature: 16,
      tempMin: 13,
      tempMax: 18,
      condition: 'Rain',
      description: 'light rain',
      icon: '10d',
    },
    {
      date: '2024-01-03T12:00:00Z',
      temperature: 19,
      tempMin: 16,
      tempMax: 21,
      condition: 'Clouds',
      description: 'few clouds',
      icon: '02d',
    },
    {
      date: '2024-01-04T12:00:00Z',
      temperature: 22,
      tempMin: 19,
      tempMax: 24,
      condition: 'Clear',
      description: 'clear sky',
      icon: '01d',
    },
    {
      date: '2024-01-05T12:00:00Z',
      temperature: 17,
      tempMin: 14,
      tempMax: 19,
      condition: 'Drizzle',
      description: 'light drizzle',
      icon: '09d',
    },
  ],
  timestamp: Date.now(),
};

// Re-export everything from React Testing Library
// eslint-disable-next-line react-refresh/only-export-components
export * from '@testing-library/react';
