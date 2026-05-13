import React from 'react';
import CurrentWeather from '../CurrentWeather';
import ForecastDisplay from '../ForecastDisplay';
import EmptyState from '../EmptyState';
import type { WeatherData, ForecastData } from '../../types/weather.types';
import './WeatherDisplay.css';

/**
 * WeatherDisplay Component Props
 */
interface WeatherDisplayProps {
  weather: WeatherData | null;
  forecast: ForecastData | null;
}

/**
 * WeatherDisplay Component
 * Combines CurrentWeather and ForecastDisplay components
 * Shows EmptyState when no weather data is available
 * Requirements: 6.4, 8.1
 */
const WeatherDisplay: React.FC<WeatherDisplayProps> = ({ weather, forecast }) => {
  // Show empty state if no weather data
  if (!weather || !forecast) {
    return <EmptyState />;
  }

  return (
    <div className="weather-display">
      <CurrentWeather weather={weather} />
      <ForecastDisplay forecast={forecast} />
    </div>
  );
};

export default WeatherDisplay;
