import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('LoadingSpinner', () => {
  it('renders loading animation', () => {
    render(<LoadingSpinner />);
    const spinnerElements = screen.getAllByRole('status');
    expect(spinnerElements).toHaveLength(3);
  });

  it('has correct styling classes', () => {
    const { container } = render(<LoadingSpinner />);
    expect(container.firstChild).toHaveClass('flex', 'items-center', 'justify-center', 'min-h-screen');
  });
});