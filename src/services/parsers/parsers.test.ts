import { describe, it, expect, beforeEach, vi } from 'vitest';
import * as fc from 'fast-check';
import { parseWeatherResponse, parseForecastResponse } from './parsers';
import type { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from '../../types/api.types';
import { openWeatherCurrentResponseArbitrary } from '../../test/arbitraries';

describe('parseWeatherResponse', () => {
  beforeEach(() => {
    // Mock Date.now() to return a consistent timestamp
    vi.spyOn(Date, 'now').mockReturnValue(1704067200000); // 2024-01-01 00:00:00 UTC
  });

  it('should transform OpenWeatherMap current weather response to WeatherData', () => {
    const apiResponse: OpenWeatherCurrentResponse = {
      name: 'London',
      main: {
        temp: 15.5,
        humidity: 65,
      },
      weather: [
        {
          main: 'Clouds',
          description: 'scattered clouds',
          icon: '03d',
        },
      ],
      wind: {
        speed: 5.2,
      },
    };

    const result = parseWeatherResponse(apiResponse);

    expect(result).toEqual({
      cityName: 'London',
      temperature: 15.5,
      condition: 'Clouds',
      description: 'scattered clouds',
      humidity: 65,
      windSpeed: 5.2,
      icon: '03d',
      timestamp: 1704067200000,
    });
  });

  it('should handle different weather conditions', () => {
    const apiResponse: OpenWeatherCurrentResponse = {
      name: 'Paris',
      main: {
        temp: 20.0,
        humidity: 70,
      },
      weather: [
        {
          main: 'Rain',
          description: 'light rain',
          icon: '10d',
        },
      ],
      wind: {
        speed: 3.5,
      },
    };

    const result = parseWeatherResponse(apiResponse);

    expect(result.condition).toBe('Rain');
    expect(result.description).toBe('light rain');
    expect(result.icon).toBe('10d');
  });

  it('should include all required fields', () => {
    const apiResponse: OpenWeatherCurrentResponse = {
      name: 'Tokyo',
      main: {
        temp: 25.0,
        humidity: 80,
      },
      weather: [
        {
          main: 'Clear',
          description: 'clear sky',
          icon: '01d',
        },
      ],
      wind: {
        speed: 2.1,
      },
    };

    const result = parseWeatherResponse(apiResponse);

    expect(result).toHaveProperty('cityName');
    expect(result).toHaveProperty('temperature');
    expect(result).toHaveProperty('condition');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('humidity');
    expect(result).toHaveProperty('windSpeed');
    expect(result).toHaveProperty('icon');
    expect(result).toHaveProperty('timestamp');
  });

  it('should use correct data types', () => {
    const apiResponse: OpenWeatherCurrentResponse = {
      name: 'Berlin',
      main: {
        temp: 10.5,
        humidity: 55,
      },
      weather: [
        {
          main: 'Snow',
          description: 'light snow',
          icon: '13d',
        },
      ],
      wind: {
        speed: 4.0,
      },
    };

    const result = parseWeatherResponse(apiResponse);

    expect(typeof result.cityName).toBe('string');
    expect(typeof result.temperature).toBe('number');
    expect(typeof result.condition).toBe('string');
    expect(typeof result.description).toBe('string');
    expect(typeof result.humidity).toBe('number');
    expect(typeof result.windSpeed).toBe('number');
    expect(typeof result.icon).toBe('string');
    expect(typeof result.timestamp).toBe('number');
  });

  /**
   * Property 4: API Response Parser Produces Valid WeatherData
   * **Validates: Requirements 5.5**
   * 
   * For any valid OpenWeatherMap API response, the parser function SHALL transform it 
   * into a WeatherData object that contains all required fields (cityName, temperature, 
   * condition, description, humidity, windSpeed, icon, timestamp) with correct data types 
   * and values.
   */
  it('property: parser transforms any valid API response to valid WeatherData', () => {
    fc.assert(
      fc.property(openWeatherCurrentResponseArbitrary(), (apiResponse) => {
        const weatherData = parseWeatherResponse(apiResponse);
        
        // Verify all required fields exist
        expect(weatherData).toHaveProperty('cityName');
        expect(weatherData).toHaveProperty('temperature');
        expect(weatherData).toHaveProperty('condition');
        expect(weatherData).toHaveProperty('description');
        expect(weatherData).toHaveProperty('humidity');
        expect(weatherData).toHaveProperty('windSpeed');
        expect(weatherData).toHaveProperty('icon');
        expect(weatherData).toHaveProperty('timestamp');
        
        // Verify correct data types
        expect(typeof weatherData.cityName).toBe('string');
        expect(typeof weatherData.temperature).toBe('number');
        expect(typeof weatherData.condition).toBe('string');
        expect(typeof weatherData.description).toBe('string');
        expect(typeof weatherData.humidity).toBe('number');
        expect(typeof weatherData.windSpeed).toBe('number');
        expect(typeof weatherData.icon).toBe('string');
        expect(typeof weatherData.timestamp).toBe('number');
        
        // Verify values are correctly mapped from API response
        expect(weatherData.cityName).toBe(apiResponse.name);
        expect(weatherData.temperature).toBe(apiResponse.main.temp);
        expect(weatherData.condition).toBe(apiResponse.weather[0].main);
        expect(weatherData.description).toBe(apiResponse.weather[0].description);
        expect(weatherData.humidity).toBe(apiResponse.main.humidity);
        expect(weatherData.windSpeed).toBe(apiResponse.wind.speed);
        expect(weatherData.icon).toBe(apiResponse.weather[0].icon);
        
        // Verify timestamp is a valid number (not NaN or Infinity)
        expect(Number.isFinite(weatherData.timestamp)).toBe(true);
        expect(weatherData.timestamp).toBeGreaterThan(0);
        
        return true;
      }),
      { numRuns: 100 }
    );
  });
});

describe('parseForecastResponse', () => {
  beforeEach(() => {
    // Mock Date.now() to return a consistent timestamp
    vi.spyOn(Date, 'now').mockReturnValue(1704067200000); // 2024-01-01 00:00:00 UTC
  });

  it('should transform OpenWeatherMap forecast response to ForecastData', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'London',
      },
      list: [
        {
          dt: 1704110400,
          dt_txt: '2024-01-01 12:00:00',
          main: {
            temp: 15.0,
            temp_min: 12.0,
            temp_max: 18.0,
          },
          weather: [
            {
              main: 'Clouds',
              description: 'few clouds',
              icon: '02d',
            },
          ],
        },
        {
          dt: 1704196800,
          dt_txt: '2024-01-02 12:00:00',
          main: {
            temp: 16.0,
            temp_min: 13.0,
            temp_max: 19.0,
          },
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
        },
        {
          dt: 1704283200,
          dt_txt: '2024-01-03 12:00:00',
          main: {
            temp: 14.0,
            temp_min: 11.0,
            temp_max: 17.0,
          },
          weather: [
            {
              main: 'Rain',
              description: 'light rain',
              icon: '10d',
            },
          ],
        },
        {
          dt: 1704369600,
          dt_txt: '2024-01-04 12:00:00',
          main: {
            temp: 13.0,
            temp_min: 10.0,
            temp_max: 16.0,
          },
          weather: [
            {
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04d',
            },
          ],
        },
        {
          dt: 1704456000,
          dt_txt: '2024-01-05 12:00:00',
          main: {
            temp: 15.0,
            temp_min: 12.0,
            temp_max: 18.0,
          },
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
        },
      ],
    };

    const result = parseForecastResponse(apiResponse);

    expect(result.cityName).toBe('London');
    expect(result.forecast).toHaveLength(5);
    expect(result.timestamp).toBe(1704067200000);
  });

  it('should extract correct forecast day data', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Paris',
      },
      list: [
        {
          dt: 1704110400,
          dt_txt: '2024-01-01 12:00:00',
          main: {
            temp: 20.0,
            temp_min: 18.0,
            temp_max: 22.0,
          },
          weather: [
            {
              main: 'Rain',
              description: 'moderate rain',
              icon: '10d',
            },
          ],
        },
      ],
    };

    const result = parseForecastResponse(apiResponse);

    expect(result.forecast[0]).toEqual({
      date: '2024-01-01',
      temperature: 20.0,
      tempMin: 18.0,
      tempMax: 22.0,
      condition: 'Rain',
      description: 'moderate rain',
      icon: '10d',
    });
  });

  it('should filter to one forecast per day', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Tokyo',
      },
      list: [
        {
          dt: 1704099600,
          dt_txt: '2024-01-01 09:00:00',
          main: { temp: 10.0, temp_min: 8.0, temp_max: 12.0 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        },
        {
          dt: 1704110400,
          dt_txt: '2024-01-01 12:00:00',
          main: { temp: 15.0, temp_min: 12.0, temp_max: 18.0 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        },
        {
          dt: 1704121200,
          dt_txt: '2024-01-01 15:00:00',
          main: { temp: 16.0, temp_min: 13.0, temp_max: 19.0 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        },
        {
          dt: 1704196800,
          dt_txt: '2024-01-02 12:00:00',
          main: { temp: 14.0, temp_min: 11.0, temp_max: 17.0 },
          weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
        },
      ],
    };

    const result = parseForecastResponse(apiResponse);

    // Should only have 2 days (one entry per unique date)
    expect(result.forecast).toHaveLength(2);
    expect(result.forecast[0].date).toBe('2024-01-01');
    expect(result.forecast[1].date).toBe('2024-01-02');
  });

  it('should prefer noon forecasts when available', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Berlin',
      },
      list: [
        {
          dt: 1704099600,
          dt_txt: '2024-01-01 09:00:00',
          main: { temp: 10.0, temp_min: 8.0, temp_max: 12.0 },
          weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
        },
        {
          dt: 1704110400,
          dt_txt: '2024-01-01 12:00:00',
          main: { temp: 15.0, temp_min: 12.0, temp_max: 18.0 },
          weather: [{ main: 'Clouds', description: 'few clouds', icon: '02d' }],
        },
      ],
    };

    const result = parseForecastResponse(apiResponse);

    // Should pick the noon forecast (12:00:00)
    expect(result.forecast[0].temperature).toBe(15.0);
    expect(result.forecast[0].condition).toBe('Clouds');
  });

  it('should include all required fields in forecast days', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Madrid',
      },
      list: [
        {
          dt: 1704110400,
          dt_txt: '2024-01-01 12:00:00',
          main: {
            temp: 18.0,
            temp_min: 15.0,
            temp_max: 21.0,
          },
          weather: [
            {
              main: 'Clear',
              description: 'clear sky',
              icon: '01d',
            },
          ],
        },
      ],
    };

    const result = parseForecastResponse(apiResponse);
    const forecastDay = result.forecast[0];

    expect(forecastDay).toHaveProperty('date');
    expect(forecastDay).toHaveProperty('temperature');
    expect(forecastDay).toHaveProperty('tempMin');
    expect(forecastDay).toHaveProperty('tempMax');
    expect(forecastDay).toHaveProperty('condition');
    expect(forecastDay).toHaveProperty('description');
    expect(forecastDay).toHaveProperty('icon');
  });

  it('should limit forecast to 5 days maximum', () => {
    const apiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Rome',
      },
      list: Array.from({ length: 40 }, (_, i) => ({
        dt: 1704110400 + i * 10800, // Every 3 hours
        dt_txt: `2024-01-${String(Math.floor(i / 8) + 1).padStart(2, '0')} 12:00:00`,
        main: {
          temp: 15.0 + i,
          temp_min: 12.0 + i,
          temp_max: 18.0 + i,
        },
        weather: [
          {
            main: 'Clear',
            description: 'clear sky',
            icon: '01d',
          },
        ],
      })),
    };

    const result = parseForecastResponse(apiResponse);

    expect(result.forecast.length).toBeLessThanOrEqual(5);
  });
});
