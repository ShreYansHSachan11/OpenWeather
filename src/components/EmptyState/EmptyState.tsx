import React from 'react';
import './EmptyState.css';

/**
 * EmptyState Component
 * Displays welcome message and search instructions when no weather data is available
 * Requirements: 6.1
 */
const EmptyState: React.FC = () => {
  return (
    <div 
      className="empty-state" 
      data-testid="empty-state"
      role="status"
      aria-live="polite"
    >
      <div className="empty-state-content">
        <div className="empty-icon" aria-hidden="true">🌤️</div>
        <h2 className="empty-state-title">Welcome to Weather Dashboard</h2>
        <p className="empty-state-message">
          Get started by searching for a city to view current weather conditions and a 5-day forecast.
        </p>
        <p className="empty-state-instruction">
          Enter a city name in the search box above to get started.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
export { EmptyState };
