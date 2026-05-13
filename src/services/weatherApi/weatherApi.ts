/**
 * Weather API Service
 * 
 * Provides functions to fetch weather data from OpenWeatherMap API
 * Uses the configured Axios client and response parsers
 * 
 * **Validates: Requirements 1.3, 1.4, 5.1**
 */

import apiClient from '../apiClient/apiClient';
import { parseWeatherResponse, parseForecastResponse } from '../parsers/parsers';
import type { WeatherData, ForecastData } from '../../types/weather.types';

/**
 * Fetch current weather for a city
 * 
 * Makes a request to the OpenWeatherMap current weather endpoint
 * and parses the response into WeatherData format
 * 
 * @param cityName - Name of the city to fetch weather for
 * @returns Promise resolving to WeatherData
 * @throws Error with user-friendly message if request fails
 * 
 * **Validates: Requirements 1.3, 5.1**
 */
export async function fetchCurrentWeather(cityName: string): Promise<WeatherData> {
  const response = await apiClient.get('/weather', {
    params: {
      q: cityName,
    },
  });
  
  return parseWeatherResponse(response.data);
}

/**
 * Fetch 5-day forecast for a city
 * 
 * Makes a request to the OpenWeatherMap 5-day forecast endpoint
 * and parses the response into ForecastData format
 * 
 * @param cityName - Name of the city to fetch forecast for
 * @returns Promise resolving to ForecastData
 * @throws Error with user-friendly message if request fails
 * 
 * **Validates: Requirements 1.4, 5.1**
 */
export async function fetchForecast(cityName: string): Promise<ForecastData> {
  const response = await apiClient.get('/forecast', {
    params: {
      q: cityName,
    },
  });
  
  return parseForecastResponse(response.data);
}
