/**
 * Core Weather Data Types
 * These interfaces define the structure of weather data used throughout the application
 */

/**
 * Represents current weather conditions for a city
 */
export interface WeatherData {
  cityName: string;
  temperature: number;
  condition: string;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
  timestamp: number; // Unix timestamp for caching
}

/**
 * Represents a single day in the forecast
 */
export interface ForecastDay {
  date: string; // ISO 8601 format
  temperature: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  icon: string;
}

/**
 * Represents 5-day forecast data for a city
 */
export interface ForecastData {
  cityName: string;
  forecast: ForecastDay[]; // Array of 5 days
  timestamp: number; // Unix timestamp for caching
}

/**
 * Cached weather data with timestamp
 */
export interface CachedWeatherData {
  weather: WeatherData;
  forecast: ForecastData;
  timestamp: number;
}
