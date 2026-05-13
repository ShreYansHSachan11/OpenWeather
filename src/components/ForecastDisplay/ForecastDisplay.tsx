import React from 'react';
import ForecastCard from '../ForecastCard';
import type { ForecastData } from '../../types/weather.types';
import './ForecastDisplay.css';

/**
 * ForecastDisplay Component Props
 */
interface ForecastDisplayProps {
  forecast: ForecastData;
}

/**
 * ForecastDisplay Component
 * Displays 5-day weather forecast using ForecastCard components
 * Requirements: 4.1, 4.5
 */
const ForecastDisplay: React.FC<ForecastDisplayProps> = ({ forecast }) => {
  return (
    <div className="forecast-display">
      <h3 className="forecast-title">5-Day Forecast</h3>
      <div className="forecast-grid">
        {forecast.forecast.map((day, index) => (
          <ForecastCard
            key={`${day.date}-${index}`}
            date={day.date}
            temperature={day.temperature}
            condition={day.condition}
            icon={day.icon}
          />
        ))}
      </div>
    </div>
  );
};

export default ForecastDisplay;
