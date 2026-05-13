import React from 'react';
import './LoadingState.css';

/**
 * LoadingState Component
 * Displays a loading spinner and message while weather data is being fetched
 * Requirements: 1.5, 6.2
 */
const LoadingState: React.FC = () => {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true"></div>
      <p className="loading-message">Loading weather data...</p>
    </div>
  );
};

export default LoadingState;
export { LoadingState };
