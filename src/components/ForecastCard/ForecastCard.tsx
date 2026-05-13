import React from 'react';
import './ForecastCard.css';

/**
 * ForecastCard Component Props
 */
interface ForecastCardProps {
  date: string;
  temperature: number;
  condition: string;
  icon: string;
}

/**
 * ForecastCard Component
 * Displays a single day's forecast information
 * Requirements: 4.2, 4.3, 4.4, 4.5
 */
const ForecastCard: React.FC<ForecastCardProps> = ({ date, temperature, condition, icon }) => {
  const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;
  
  // Format date to show day of week
  const formatDate = (dateString: string): string => {
    const dateObj = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    return dateObj.toLocaleDateString('en-US', options);
  };

  return (
    <div className="forecast-card">
      <div className="forecast-date">{formatDate(date)}</div>
      <img 
        src={iconUrl} 
        alt={condition}
        className="forecast-icon"
      />
      <div className="forecast-temp">{Math.round(temperature)}°C</div>
      <div className="forecast-condition">{condition}</div>
    </div>
  );
};

export default ForecastCard;
