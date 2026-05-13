/**
 * Unit tests for ErrorState component
 * Tests rendering, accessibility, and user interactions
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { ErrorState } from './ErrorState';

describe('ErrorState Component', () => {
  describe('Rendering', () => {
    it('renders error message', () => {
      const errorMessage = 'City not found. Please check the spelling and try again.';
      render(<ErrorState message={errorMessage} />);
      
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });

    it('renders with data-testid attribute', () => {
      render(<ErrorState message="Test error" />);
      
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
    });

    it('renders error icon', () => {
      render(<ErrorState message="Test error" />);
      
      const icon = screen.getByText('⚠️');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('Retry Button', () => {
    it('renders retry button when onRetry callback is provided', () => {
      const onRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toBeInTheDocument();
      expect(retryButton).toHaveTextContent('Try Again');
    });

    it('does not render retry button when onRetry is not provided', () => {
      render(<ErrorState message="Test error" />);
      
      const retryButton = screen.queryByRole('button', { name: 'Retry' });
      expect(retryButton).not.toBeInTheDocument();
    });

    it('calls onRetry callback when retry button is clicked', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      await user.click(retryButton);
      
      expect(onRetry).toHaveBeenCalledTimes(1);
    });

    it('calls onRetry multiple times when clicked multiple times', async () => {
      const user = userEvent.setup();
      const onRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /try again/i });
      await user.click(retryButton);
      await user.click(retryButton);
      await user.click(retryButton);
      
      expect(onRetry).toHaveBeenCalledTimes(3);
    });
  });

  describe('Accessibility', () => {
    it('has role="alert" for screen readers', () => {
      render(<ErrorState message="Test error" />);
      
      const errorState = screen.getByRole('alert');
      expect(errorState).toBeInTheDocument();
    });

    it('has aria-live="assertive" for immediate announcement', () => {
      render(<ErrorState message="Test error" />);
      
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toHaveAttribute('aria-live', 'assertive');
    });

    it('retry button has proper aria-label', () => {
      const onRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: 'Retry' });
      expect(retryButton).toHaveAttribute('aria-label', 'Retry');
    });

    it('retry button has type="button" to prevent form submission', () => {
      const onRetry = vi.fn();
      render(<ErrorState message="Test error" onRetry={onRetry} />);
      
      const retryButton = screen.getByRole('button', { name: /try again/i });
      expect(retryButton).toHaveAttribute('type', 'button');
    });
  });

  describe('Requirements Validation', () => {
    it('validates Requirement 1.6: displays error when city is not found', () => {
      const cityNotFoundMessage = "City 'InvalidCity' not found. Please check the spelling and try again.";
      render(<ErrorState message={cityNotFoundMessage} />);
      
      expect(screen.getByText(cityNotFoundMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('validates Requirement 1.7: displays error when API request fails', () => {
      const apiErrorMessage = 'Weather service is temporarily unavailable. Please try again later.';
      render(<ErrorState message={apiErrorMessage} />);
      
      expect(screen.getByText(apiErrorMessage)).toBeInTheDocument();
      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('validates Requirement 6.3: displays error state with error message', () => {
      const errorMessage = 'No internet connection. Please check your network and try again.';
      const onRetry = vi.fn();
      render(<ErrorState message={errorMessage} onRetry={onRetry} />);
      
      // Error message is displayed
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
      
      // Error state is accessible
      expect(screen.getByRole('alert')).toBeInTheDocument();
      
      // Retry functionality is available
      expect(screen.getByRole('button', { name: /try again/i })).toBeInTheDocument();
    });
  });

  describe('Edge Cases', () => {
    it('handles empty error message', () => {
      render(<ErrorState message="" />);
      
      const errorState = screen.getByTestId('error-state');
      expect(errorState).toBeInTheDocument();
    });

    it('handles very long error messages', () => {
      const longMessage = 'A'.repeat(500);
      render(<ErrorState message={longMessage} />);
      
      expect(screen.getByText(longMessage)).toBeInTheDocument();
    });

    it('handles special characters in error message', () => {
      const specialMessage = "Error: <script>alert('xss')</script> & \"quotes\" 'apostrophes'";
      render(<ErrorState message={specialMessage} />);
      
      expect(screen.getByText(specialMessage)).toBeInTheDocument();
    });

    it('handles undefined onRetry gracefully', () => {
      render(<ErrorState message="Test error" onRetry={undefined} />);
      
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
  });
});
