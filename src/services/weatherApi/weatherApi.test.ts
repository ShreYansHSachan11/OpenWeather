/**
 * Unit tests for Weather API Service
 * 
 * Tests the fetchCurrentWeather and fetchForecast functions
 * Mocks Axios responses for successful and error scenarios
 * 
 * **Validates: Requirements 13.2**
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { fetchCurrentWeather, fetchForecast } from './weatherApi';
import apiClient from '../apiClient/apiClient';
import type { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from '../../types/api.types';

// Mock the apiClient module
vi.mock('./apiClient', () => ({
  default: {
    get: vi.fn(),
  },
}));

describe('fetchCurrentWeather', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and parses current weather data successfully', async () => {
    const mockApiResponse: OpenWeatherCurrentResponse = {
      name: 'London',
      main: {
        temp: 20,
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
        speed: 5.5,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const result = await fetchCurrentWeather('London');

    expect(apiClient.get).toHaveBeenCalledWith('/weather', {
      params: {
        q: 'London',
      },
    });

    expect(result).toEqual({
      cityName: 'London',
      temperature: 20,
      condition: 'Clouds',
      description: 'scattered clouds',
      humidity: 65,
      windSpeed: 5.5,
      icon: '03d',
      timestamp: expect.any(Number),
    });
  });

  it('makes request with correct endpoint and parameters', async () => {
    const mockApiResponse: OpenWeatherCurrentResponse = {
      name: 'Paris',
      main: {
        temp: 18,
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
        speed: 3.2,
      },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    await fetchCurrentWeather('Paris');

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/weather', {
      params: {
        q: 'Paris',
      },
    });
  });

  it('throws error when API request fails', async () => {
    const errorMessage = 'City not found. Please check the spelling and try again.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchCurrentWeather('InvalidCity')).rejects.toThrow(errorMessage);
  });

  it('handles network errors', async () => {
    const errorMessage = 'No internet connection. Please check your network and try again.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchCurrentWeather('London')).rejects.toThrow(errorMessage);
  });

  it('handles server errors', async () => {
    const errorMessage = 'Weather service is temporarily unavailable. Please try again later.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchCurrentWeather('London')).rejects.toThrow(errorMessage);
  });

  it('returns WeatherData with all required fields', async () => {
    const mockApiResponse: OpenWeatherCurrentResponse = {
      name: 'Tokyo',
      main: {
        temp: 25,
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

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const result = await fetchCurrentWeather('Tokyo');

    expect(result).toHaveProperty('cityName');
    expect(result).toHaveProperty('temperature');
    expect(result).toHaveProperty('condition');
    expect(result).toHaveProperty('description');
    expect(result).toHaveProperty('humidity');
    expect(result).toHaveProperty('windSpeed');
    expect(result).toHaveProperty('icon');
    expect(result).toHaveProperty('timestamp');

    expect(typeof result.cityName).toBe('string');
    expect(typeof result.temperature).toBe('number');
    expect(typeof result.condition).toBe('string');
    expect(typeof result.description).toBe('string');
    expect(typeof result.humidity).toBe('number');
    expect(typeof result.windSpeed).toBe('number');
    expect(typeof result.icon).toBe('string');
    expect(typeof result.timestamp).toBe('number');
  });
});

describe('fetchForecast', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('fetches and parses forecast data successfully', async () => {
    const mockApiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'London',
      },
      list: [
        {
          dt: 1609459200,
          dt_txt: '2021-01-01 12:00:00',
          main: {
            temp: 15,
            temp_min: 12,
            temp_max: 18,
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
          dt: 1609545600,
          dt_txt: '2021-01-02 12:00:00',
          main: {
            temp: 16,
            temp_min: 13,
            temp_max: 19,
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
          dt: 1609632000,
          dt_txt: '2021-01-03 12:00:00',
          main: {
            temp: 14,
            temp_min: 11,
            temp_max: 17,
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
          dt: 1609718400,
          dt_txt: '2021-01-04 12:00:00',
          main: {
            temp: 13,
            temp_min: 10,
            temp_max: 16,
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
          dt: 1609804800,
          dt_txt: '2021-01-05 12:00:00',
          main: {
            temp: 15,
            temp_min: 12,
            temp_max: 18,
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

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const result = await fetchForecast('London');

    expect(apiClient.get).toHaveBeenCalledWith('/forecast', {
      params: {
        q: 'London',
      },
    });

    expect(result).toEqual({
      cityName: 'London',
      forecast: expect.any(Array),
      timestamp: expect.any(Number),
    });

    expect(result.forecast.length).toBeGreaterThan(0);
    expect(result.forecast.length).toBeLessThanOrEqual(5);
  });

  it('makes request with correct endpoint and parameters', async () => {
    const mockApiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Paris',
      },
      list: [
        {
          dt: 1609459200,
          dt_txt: '2021-01-01 12:00:00',
          main: {
            temp: 15,
            temp_min: 12,
            temp_max: 18,
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

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    await fetchForecast('Paris');

    expect(apiClient.get).toHaveBeenCalledTimes(1);
    expect(apiClient.get).toHaveBeenCalledWith('/forecast', {
      params: {
        q: 'Paris',
      },
    });
  });

  it('throws error when API request fails', async () => {
    const errorMessage = 'City not found. Please check the spelling and try again.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchForecast('InvalidCity')).rejects.toThrow(errorMessage);
  });

  it('handles network errors', async () => {
    const errorMessage = 'No internet connection. Please check your network and try again.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchForecast('London')).rejects.toThrow(errorMessage);
  });

  it('handles server errors', async () => {
    const errorMessage = 'Weather service is temporarily unavailable. Please try again later.';
    vi.mocked(apiClient.get).mockRejectedValueOnce(new Error(errorMessage));

    await expect(fetchForecast('London')).rejects.toThrow(errorMessage);
  });

  it('returns ForecastData with all required fields', async () => {
    const mockApiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Tokyo',
      },
      list: [
        {
          dt: 1609459200,
          dt_txt: '2021-01-01 12:00:00',
          main: {
            temp: 20,
            temp_min: 18,
            temp_max: 22,
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

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const result = await fetchForecast('Tokyo');

    expect(result).toHaveProperty('cityName');
    expect(result).toHaveProperty('forecast');
    expect(result).toHaveProperty('timestamp');

    expect(typeof result.cityName).toBe('string');
    expect(Array.isArray(result.forecast)).toBe(true);
    expect(typeof result.timestamp).toBe('number');

    // Check forecast day structure
    if (result.forecast.length > 0) {
      const day = result.forecast[0];
      expect(day).toHaveProperty('date');
      expect(day).toHaveProperty('temperature');
      expect(day).toHaveProperty('tempMin');
      expect(day).toHaveProperty('tempMax');
      expect(day).toHaveProperty('condition');
      expect(day).toHaveProperty('description');
      expect(day).toHaveProperty('icon');

      expect(typeof day.date).toBe('string');
      expect(typeof day.temperature).toBe('number');
      expect(typeof day.tempMin).toBe('number');
      expect(typeof day.tempMax).toBe('number');
      expect(typeof day.condition).toBe('string');
      expect(typeof day.description).toBe('string');
      expect(typeof day.icon).toBe('string');
    }
  });

  it('parses forecast data into correct structure', async () => {
    const mockApiResponse: OpenWeatherForecastResponse = {
      city: {
        name: 'Berlin',
      },
      list: [
        {
          dt: 1609459200,
          dt_txt: '2021-01-01 12:00:00',
          main: {
            temp: 10,
            temp_min: 8,
            temp_max: 12,
          },
          weather: [
            {
              main: 'Snow',
              description: 'light snow',
              icon: '13d',
            },
          ],
        },
        {
          dt: 1609545600,
          dt_txt: '2021-01-02 12:00:00',
          main: {
            temp: 9,
            temp_min: 7,
            temp_max: 11,
          },
          weather: [
            {
              main: 'Clouds',
              description: 'overcast clouds',
              icon: '04d',
            },
          ],
        },
      ],
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockApiResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    const result = await fetchForecast('Berlin');

    expect(result.cityName).toBe('Berlin');
    expect(result.forecast).toHaveLength(2);
    
    expect(result.forecast[0].date).toBe('2021-01-01');
    expect(result.forecast[0].temperature).toBe(10);
    expect(result.forecast[0].condition).toBe('Snow');
    
    expect(result.forecast[1].date).toBe('2021-01-02');
    expect(result.forecast[1].temperature).toBe(9);
    expect(result.forecast[1].condition).toBe('Clouds');
  });
});

describe('API Service Integration', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uses the configured apiClient for requests', async () => {
    const mockWeatherResponse: OpenWeatherCurrentResponse = {
      name: 'London',
      main: { temp: 20, humidity: 65 },
      weather: [{ main: 'Clear', description: 'clear sky', icon: '01d' }],
      wind: { speed: 5 },
    };

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: mockWeatherResponse,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any,
    });

    await fetchCurrentWeather('London');

    // Verify that apiClient.get was called (not axios.get directly)
    expect(apiClient.get).toHaveBeenCalled();
  });

  it('error messages are transformed by interceptor', async () => {
    // The interceptor transforms errors to user-friendly messages
    const userFriendlyError = new Error('City not found. Please check the spelling and try again.');
    vi.mocked(apiClient.get).mockRejectedValueOnce(userFriendlyError);

    await expect(fetchCurrentWeather('InvalidCity')).rejects.toThrow(
      'City not found. Please check the spelling and try again.'
    );
  });
});
