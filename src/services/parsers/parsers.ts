import type { OpenWeatherCurrentResponse, OpenWeatherForecastResponse } from '../types/api.types';
import type { WeatherData, ForecastData, ForecastDay } from '../types/weather.types';

/**
 * Parse OpenWeatherMap current weather API response to WeatherData
 * 
 * Transforms the API response structure into our application's WeatherData format
 * Adds timestamp for caching purposes
 * 
 * @param response - OpenWeatherMap current weather API response
 * @returns WeatherData object with all required fields
 */
export function parseWeatherResponse(response: OpenWeatherCurrentResponse): WeatherData {
  return {
    cityName: response.name,
    temperature: response.main.temp,
    condition: response.weather[0].main,
    description: response.weather[0].description,
    humidity: response.main.humidity,
    windSpeed: response.wind.speed,
    icon: response.weather[0].icon,
    timestamp: Date.now(),
  };
}

/**
 * Parse OpenWeatherMap 5-day forecast API response to ForecastData
 * 
 * Transforms the API response structure into our application's ForecastData format
 * Filters forecast entries to get one per day (around noon)
 * Adds timestamp for caching purposes
 * 
 * @param response - OpenWeatherMap 5-day forecast API response
 * @returns ForecastData object with 5-day forecast
 */
export function parseForecastResponse(response: OpenWeatherForecastResponse): ForecastData {
  // OpenWeatherMap returns forecasts every 3 hours
  // We want to extract one forecast per day, preferably around noon (12:00)
  const dailyForecasts: ForecastDay[] = [];
  const forecastsByDate = new Map<string, typeof response.list[0][]>();

  // Group forecasts by date
  for (const item of response.list) {
    const date = item.dt_txt.split(' ')[0];
    if (!forecastsByDate.has(date)) {
      forecastsByDate.set(date, []);
    }
    forecastsByDate.get(date)!.push(item);
  }

  // For each date, pick the forecast closest to noon
  for (const [date, forecasts] of forecastsByDate) {
    if (dailyForecasts.length >= 5) {
      break;
    }

    // Find the forecast closest to noon (12:00:00)
    let bestForecast = forecasts[0];
    let bestTimeDiff = Infinity;

    for (const forecast of forecasts) {
      const time = forecast.dt_txt.split(' ')[1];
      const hour = parseInt(time.split(':')[0], 10);
      const timeDiff = Math.abs(hour - 12);

      if (timeDiff < bestTimeDiff) {
        bestTimeDiff = timeDiff;
        bestForecast = forecast;
      }
    }

    dailyForecasts.push({
      date: date, // ISO 8601 format (YYYY-MM-DD)
      temperature: bestForecast.main.temp,
      tempMin: bestForecast.main.temp_min,
      tempMax: bestForecast.main.temp_max,
      condition: bestForecast.weather[0].main,
      description: bestForecast.weather[0].description,
      icon: bestForecast.weather[0].icon,
    });
  }

  return {
    cityName: response.city.name,
    forecast: dailyForecasts,
    timestamp: Date.now(),
  };
}
