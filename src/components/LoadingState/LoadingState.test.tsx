/**
 * LoadingState Component Tests
 * 
 * Tests for the LoadingState component including:
 * - Rendering of loading spinner and message
 * - Accessibility attributes
 * - Component structure
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingState from './LoadingState';

describe('LoadingState Component', () => {
  describe('Rendering', () => {
    it('renders loading message', () => {
      render(<LoadingState />);
      
      const message = screen.getByText('Loading weather data...');
      expect(message).toBeInTheDocument();
    });

    it('renders loading spinner', () => {
      const { container } = render(<LoadingState />);
      
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toBeInTheDocument();
    });

    it('renders container with correct structure', () => {
      const { container } = render(<LoadingState />);
      
      const loadingState = container.querySelector('.loading-state');
      expect(loadingState).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has role="status" for screen readers', () => {
      render(<LoadingState />);
      
      const statusElement = screen.getByRole('status');
      expect(statusElement).toBeInTheDocument();
    });

    it('has aria-live="polite" for screen reader announcements', () => {
      const { container } = render(<LoadingState />);
      
      const loadingState = container.querySelector('.loading-state');
      expect(loadingState).toHaveAttribute('aria-live', 'polite');
    });

    it('spinner has aria-hidden="true" to hide from screen readers', () => {
      const { container } = render(<LoadingState />);
      
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveAttribute('aria-hidden', 'true');
    });

    it('provides text content for screen readers', () => {
      render(<LoadingState />);
      
      // Screen readers will announce "Loading weather data..."
      const message = screen.getByText('Loading weather data...');
      expect(message).toBeVisible();
    });
  });

  describe('Component Structure', () => {
    it('renders without crashing', () => {
      const { container } = render(<LoadingState />);
      expect(container).toBeTruthy();
    });

    it('contains exactly one loading message', () => {
      render(<LoadingState />);
      
      const messages = screen.getAllByText('Loading weather data...');
      expect(messages).toHaveLength(1);
    });

    it('contains exactly one loading spinner', () => {
      const { container } = render(<LoadingState />);
      
      const spinners = container.querySelectorAll('.loading-spinner');
      expect(spinners).toHaveLength(1);
    });
  });

  describe('CSS Classes', () => {
    it('applies loading-state class to container', () => {
      const { container } = render(<LoadingState />);
      
      const loadingState = container.querySelector('.loading-state');
      expect(loadingState).toHaveClass('loading-state');
    });

    it('applies loading-spinner class to spinner', () => {
      const { container } = render(<LoadingState />);
      
      const spinner = container.querySelector('.loading-spinner');
      expect(spinner).toHaveClass('loading-spinner');
    });

    it('applies loading-message class to message', () => {
      const { container } = render(<LoadingState />);
      
      const message = container.querySelector('.loading-message');
      expect(message).toHaveClass('loading-message');
    });
  });
});
