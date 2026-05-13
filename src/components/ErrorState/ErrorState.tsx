import React from 'react';
import './ErrorState.css';

/**
 * ErrorState Component Props
 */
interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

/**
 * ErrorState Component
 * Displays error messages with optional retry functionality
 * Requirements: 1.6, 1.7, 6.3
 */
const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  return (
    <div 
      className="error-state" 
      data-testid="error-state"
      role="alert" 
      aria-live="assertive"
    >
      <div className="error-icon" aria-hidden="true">⚠️</div>
      <p className="error-message">{message}</p>
      {onRetry && (
        <button 
          type="button"
          className="retry-button" 
          onClick={onRetry}
          aria-label="Try Again"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
export { ErrorState };
