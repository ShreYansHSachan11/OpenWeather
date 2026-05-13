/**
 * Example usage of the apiClient with response parsers
 * 
 * This file demonstrates how to use the configured Axios instance
 * for making API requests to OpenWeatherMap and parsing the responses.
 */

import apiClient from './apiClient';
import { parseWeatherResponse, parseForecastResponse } from '../parsers';
import type { WeatherData, ForecastData } from '../../types/weather.types';

/**
 * Example: Fetch current weather for a city
 */
export async function exampleFetchCurrentWeather(cityName: string): Promise<WeatherData> {
  try {
    const response = await apiClient.get('/weather', {
      params: {
        q: cityName, // City name parameter
      },
    });
    
    // Parse the API response to WeatherData format
    const weatherData = parseWeatherResponse(response.data);
    console.log('Weather data:', weatherData);
    return weatherData;
  } catch (error: any) {
    // Error is already transformed by the interceptor
    console.error('Error fetching weather:', error.message);
    throw error;
  }
}

/**
 * Example: Fetch 5-day forecast for a city
 */
export async function exampleFetchForecast(cityName: string): Promise<ForecastData> {
  try {
    const response = await apiClient.get('/forecast', {
      params: {
        q: cityName, // City name parameter
      },
    });
    
    // Parse the API response to ForecastData format
    const forecastData = parseForecastResponse(response.data);
    console.log('Forecast data:', forecastData);
    return forecastData;
  } catch (error: any) {
    // Error is already transformed by the interceptor
    console.error('Error fetching forecast:', error.message);
    throw error;
  }
}

/**
 * Benefits of using the configured apiClient with parsers:
 * 
 * 1. Base URL is already configured - just use relative paths like '/weather'
 * 2. API key is automatically included in all requests
 * 3. Metric units are set by default
 * 4. Errors are automatically transformed to user-friendly messages
 * 5. 10-second timeout is configured to prevent hanging requests
 * 6. Consistent error handling across all API calls
 * 7. Response parsers transform API data to application types
 * 8. Timestamps are automatically added for caching
 */
