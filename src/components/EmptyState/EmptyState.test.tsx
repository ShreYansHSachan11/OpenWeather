/**
 * Unit tests for EmptyState component
 * 
 * Tests the rendering and accessibility of the EmptyState component
 * that displays welcome message and search instructions.
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from './EmptyState';

describe('EmptyState Component', () => {
  it('renders welcome message', () => {
    render(<EmptyState />);
    
    const title = screen.getByRole('heading', { name: /welcome to weather dashboard/i });
    expect(title).toBeInTheDocument();
  });

  it('renders search instructions', () => {
    render(<EmptyState />);
    
    const instruction = screen.getByText(/get started by searching for a city/i);
    expect(instruction).toBeInTheDocument();
  });

  it('renders input instruction', () => {
    render(<EmptyState />);
    
    const inputInstruction = screen.getByText(/enter a city name in the search box above/i);
    expect(inputInstruction).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<EmptyState />);
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toHaveAttribute('role', 'status');
    expect(emptyState).toHaveAttribute('aria-live', 'polite');
  });

  it('renders with correct CSS class', () => {
    render(<EmptyState />);
    
    const emptyState = screen.getByTestId('empty-state');
    expect(emptyState).toHaveClass('empty-state');
  });

  it('contains content wrapper with correct class', () => {
    const { container } = render(<EmptyState />);
    
    const contentWrapper = container.querySelector('.empty-state-content');
    expect(contentWrapper).toBeInTheDocument();
  });

  it('displays all text elements in correct order', () => {
    const { container } = render(<EmptyState />);
    
    const title = container.querySelector('.empty-state-title');
    const message = container.querySelector('.empty-state-message');
    const instruction = container.querySelector('.empty-state-instruction');
    
    expect(title).toBeInTheDocument();
    expect(message).toBeInTheDocument();
    expect(instruction).toBeInTheDocument();
    
    // Verify order
    expect(title?.textContent).toBe('Welcome to Weather Dashboard');
    expect(message?.textContent).toContain('Get started by searching');
    expect(instruction?.textContent).toContain('Enter a city name');
  });

  it('is accessible to screen readers', () => {
    render(<EmptyState />);
    
    // Check that the component has proper semantic structure
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    
    // Check that status role is present for screen reader announcements
    const status = screen.getByRole('status');
    expect(status).toBeInTheDocument();
  });
});
