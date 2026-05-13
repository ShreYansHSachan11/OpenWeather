/**
 * Fast-check arbitraries for property-based testing
 * These generators create random test data for property tests
 */

import * as fc from 'fast-check';
import type {
  WeatherData,
  ForecastDay,
  ForecastData,
  OpenWeatherCurrentResponse,
  OpenWeatherForecastResponse,
  WeatherState,
  UIState,
} from '@/types';

/**
 * Generates random WeatherData objects
 */
export const weatherDataArbitrary = (): fc.Arbitrary<WeatherData> =>
  fc.record({
    cityName: fc.string({ minLength: 1, maxLength: 50 }),
    temperature: fc.double({ min: -50, max: 50 }),
    condition: fc.constantFrom('Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'),
    description: fc.string({ minLength: 1, maxLength: 100 }),
    humidity: fc.integer({ min: 0, max: 100 }),
    windSpeed: fc.double({ min: 0, max: 100 }),
    icon: fc.string({ minLength: 3, maxLength: 3 }),
    timestamp: fc.integer({ min: 0, max: Date.now() }),
  });

/**
 * Generates random ForecastDay objects
 */
export const forecastDayArbitrary = (): fc.Arbitrary<ForecastDay> =>
  fc.record({
    date: fc.date().map((d) => d.toISOString()),
    temperature: fc.double({ min: -50, max: 50 }),
    tempMin: fc.double({ min: -50, max: 50 }),
    tempMax: fc.double({ min: -50, max: 50 }),
    condition: fc.constantFrom('Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'),
    description: fc.string({ minLength: 1, maxLength: 100 }),
    icon: fc.string({ minLength: 3, maxLength: 3 }),
  });

/**
 * Generates random ForecastData objects
 */
export const forecastDataArbitrary = (): fc.Arbitrary<ForecastData> =>
  fc.record({
    cityName: fc.string({ minLength: 1, maxLength: 50 }),
    forecast: fc.array(forecastDayArbitrary(), { minLength: 5, maxLength: 5 }),
    timestamp: fc.integer({ min: 0, max: Date.now() }),
  });

/**
 * Generates random OpenWeatherMap current weather API responses
 */
export const openWeatherCurrentResponseArbitrary = (): fc.Arbitrary<OpenWeatherCurrentResponse> =>
  fc.record({
    name: fc.string({ minLength: 1, maxLength: 50 }),
    main: fc.record({
      temp: fc.double({ min: -50, max: 50 }),
      humidity: fc.integer({ min: 0, max: 100 }),
    }),
    weather: fc.array(
      fc.record({
        main: fc.constantFrom('Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'),
        description: fc.string({ minLength: 1, maxLength: 100 }),
        icon: fc.string({ minLength: 3, maxLength: 3 }),
      }),
      { minLength: 1, maxLength: 1 }
    ),
    wind: fc.record({
      speed: fc.double({ min: 0, max: 100 }),
    }),
  });

/**
 * Generates random OpenWeatherMap forecast API responses
 */
export const openWeatherForecastResponseArbitrary = (): fc.Arbitrary<OpenWeatherForecastResponse> =>
  fc.record({
    city: fc.record({
      name: fc.string({ minLength: 1, maxLength: 50 }),
    }),
    list: fc.array(
      fc.record({
        dt: fc.integer({ min: 0, max: Date.now() / 1000 }),
        dt_txt: fc.date().map((d) => d.toISOString()),
        main: fc.record({
          temp: fc.double({ min: -50, max: 50 }),
          temp_min: fc.double({ min: -50, max: 50 }),
          temp_max: fc.double({ min: -50, max: 50 }),
        }),
        weather: fc.array(
          fc.record({
            main: fc.constantFrom('Clear', 'Clouds', 'Rain', 'Snow', 'Thunderstorm', 'Drizzle', 'Mist'),
            description: fc.string({ minLength: 1, maxLength: 100 }),
            icon: fc.string({ minLength: 3, maxLength: 3 }),
          }),
          { minLength: 1, maxLength: 1 }
        ),
      }),
      { minLength: 40, maxLength: 40 } // 5 days * 8 readings per day
    ),
  });

/**
 * Generates random WeatherState objects
 */
export const weatherStateArbitrary = (): fc.Arbitrary<WeatherState> =>
  fc.record({
    currentWeather: fc.option(weatherDataArbitrary(), { nil: null }),
    forecast: fc.option(forecastDataArbitrary(), { nil: null }),
    loading: fc.boolean(),
    error: fc.option(fc.string(), { nil: null }),
    cache: fc.dictionary(fc.string(), fc.record({
      weather: weatherDataArbitrary(),
      forecast: forecastDataArbitrary(),
      timestamp: fc.integer({ min: 0, max: Date.now() }),
    })),
  });

/**
 * Generates random UIState objects
 */
export const uiStateArbitrary = (): fc.Arbitrary<UIState> =>
  fc.record({
    theme: fc.constantFrom('light', 'dark'),
    searchHistory: fc.array(fc.string({ minLength: 1, maxLength: 50 }), { maxLength: 10 }),
  });

/**
 * Generates random error objects
 */
export const errorArbitrary = (): fc.Arbitrary<Error> =>
  fc.oneof(
    fc.record({
      message: fc.string({ minLength: 1 }),
      name: fc.constant('Error'),
    }).map((obj) => Object.assign(new Error(obj.message), obj)),
    fc.record({
      message: fc.string({ minLength: 1 }),
      name: fc.constant('NetworkError'),
    }).map((obj) => Object.assign(new Error(obj.message), obj)),
    fc.record({
      message: fc.string({ minLength: 1 }),
      name: fc.constant('APIError'),
      response: fc.record({
        status: fc.constantFrom(400, 401, 404, 429, 500, 502, 503),
        data: fc.object(),
      }),
    }).map((obj) => Object.assign(new Error(obj.message), obj))
  );

/**
 * Generates random AxiosError-like objects for testing error handlers
 * Covers HTTP errors, network errors, and generic errors
 */
export const axiosErrorArbitrary = (): fc.Arbitrary<any> =>
  fc.oneof(
    // HTTP errors with response (404, 401, 429, 500, 502, 503, and other status codes)
    fc.record({
      response: fc.record({
        status: fc.oneof(
          fc.constantFrom(404, 401, 429, 500, 502, 503), // Known status codes
          fc.integer({ min: 400, max: 599 }) // Other HTTP error codes
        ),
        data: fc.object(),
        statusText: fc.string(),
        headers: fc.object(),
        config: fc.object(),
      }),
      request: fc.object(),
      config: fc.object(),
      isAxiosError: fc.constant(true),
      toJSON: fc.constant(() => ({})),
      name: fc.constant('AxiosError'),
      message: fc.string(),
    }),
    // Network errors (no response)
    fc.record({
      request: fc.object(),
      config: fc.object(),
      isAxiosError: fc.constant(true),
      toJSON: fc.constant(() => ({})),
      name: fc.constant('AxiosError'),
      message: fc.constant('Network Error'),
    }),
    // Generic errors (no request or response)
    fc.record({
      message: fc.string({ minLength: 1 }),
      name: fc.constant('Error'),
    }).map((obj) => Object.assign(new Error(obj.message), obj)),
    // Unknown error types
    fc.object()
  );
