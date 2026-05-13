import React from 'react';
import type { WeatherData } from '../types/weather.types';
import './CurrentWeather.css';

/**
 * CurrentWeather Component Props
 */
interface CurrentWeatherProps {
  weather: WeatherData;
}

/**
 * CurrentWeather Component
 * Displays current weather conditions including temperature, condition, humidity, and wind speed
 * Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */
const CurrentWeather: React.FC<CurrentWeatherProps> = ({ weather }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${weather.icon}@2x.png`;

  return (
    <div className="current-weather">
      <div className="current-weather-header">
        <h2 className="current-weather-city">{weather.cityName}</h2>
        <img 
          src={iconUrl} 
          alt={weather.description}
          className="current-weather-icon"
        />
      </div>
      
      <div className="current-weather-main">
        <div className="current-weather-temp">{Math.round(weather.temperature)}°C</div>
        <div className="current-weather-condition">{weather.condition}</div>
        <div className="current-weather-description">{weather.description}</div>
      </div>

      <div className="current-weather-details">
        <div className="weather-detail">
          <span className="weather-detail-label">Humidity</span>
          <span className="weather-detail-value">{weather.humidity}%</span>
        </div>
        <div className="weather-detail">
          <span className="weather-detail-label">Wind Speed</span>
          <span className="weather-detail-value">{weather.windSpeed} m/s</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
