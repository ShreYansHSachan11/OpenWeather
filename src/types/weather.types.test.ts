/**
 * Basic tests to verify testing framework setup
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { weatherDataArbitrary, forecastDataArbitrary } from '@/test/arbitraries';

describe('Testing Framework Setup', () => {
  it('should run basic unit tests', () => {
    expect(true).toBe(true);
  });

  it('should generate WeatherData with fast-check', () => {
    fc.assert(
      fc.property(weatherDataArbitrary(), (weatherData) => {
        expect(weatherData).toHaveProperty('cityName');
        expect(weatherData).toHaveProperty('temperature');
        expect(weatherData).toHaveProperty('condition');
        expect(weatherData).toHaveProperty('humidity');
        expect(weatherData).toHaveProperty('windSpeed');
        expect(weatherData).toHaveProperty('icon');
        expect(weatherData).toHaveProperty('timestamp');
        return true;
      }),
      { numRuns: 10 }
    );
  });

  it('should generate ForecastData with fast-check', () => {
    fc.assert(
      fc.property(forecastDataArbitrary(), (forecastData) => {
        expect(forecastData).toHaveProperty('cityName');
        expect(forecastData).toHaveProperty('forecast');
        expect(forecastData.forecast).toHaveLength(5);
        expect(forecastData).toHaveProperty('timestamp');
        return true;
      }),
      { numRuns: 10 }
    );
  });
});

describe('TypeScript Type Definitions', () => {
  it('should have correct WeatherData structure', () => {
    const weatherData = {
      cityName: 'London',
      temperature: 20,
      condition: 'Clouds',
      description: 'scattered clouds',
      humidity: 65,
      windSpeed: 15,
      icon: '04d',
      timestamp: Date.now(),
    };

    expect(weatherData.cityName).toBe('London');
    expect(typeof weatherData.temperature).toBe('number');
    expect(typeof weatherData.humidity).toBe('number');
  });

  it('should have correct ForecastData structure', () => {
    const forecastData = {
      cityName: 'Paris',
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
      ],
      timestamp: Date.now(),
    };

    expect(forecastData.cityName).toBe('Paris');
    expect(Array.isArray(forecastData.forecast)).toBe(true);
    expect(forecastData.forecast[0]).toHaveProperty('date');
    expect(forecastData.forecast[0]).toHaveProperty('temperature');
  });
});
