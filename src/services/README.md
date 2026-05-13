# Services Directory

This directory contains service layer code for external API communication.

## Structure

- **apiClient.ts**: Axios instance configuration with centralized error handling
- **parsers.ts**: API response transformation utilities (parseWeatherResponse, parseForecastResponse)
- **weatherApi.ts**: Weather API service functions (fetchCurrentWeather, fetchForecast)
- **index.ts**: Central export point for all service layer functionality

## API Functions

### fetchCurrentWeather(cityName: string)
Fetches current weather data for a specified city from OpenWeatherMap API.

**Parameters:**
- `cityName` (string): Name of the city to fetch weather for

**Returns:**
- `Promise<WeatherData>`: Current weather data with temperature, condition, humidity, wind speed, etc.

**Throws:**
- Error with user-friendly message if request fails

**Example:**
```typescript
import { fetchCurrentWeather } from './services';

const weather = await fetchCurrentWeather('London');
console.log(weather.temperature); // 20
```

### fetchForecast(cityName: string)
Fetches 5-day weather forecast for a specified city from OpenWeatherMap API.

**Parameters:**
- `cityName` (string): Name of the city to fetch forecast for

**Returns:**
- `Promise<ForecastData>`: 5-day forecast data with daily predictions

**Throws:**
- Error with user-friendly message if request fails

**Example:**
```typescript
import { fetchForecast } from './services';

const forecast = await fetchForecast('Paris');
console.log(forecast.forecast.length); // 5
```

## Service Guidelines

- Use Axios for all HTTP requests
- Implement error handling and retry logic
- Transform API responses to application types
- Keep services independent of Redux
