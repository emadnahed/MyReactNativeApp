import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ErrorView from '../ErrorView';

describe('ErrorView', () => {
  it('should render with default message', () => {
    const { getByText } = render(<ErrorView />);
    expect(getByText('⚠️')).toBeTruthy();
    expect(getByText('Something went wrong')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const { getByText } = render(<ErrorView message="Network error occurred" />);
    expect(getByText('Network error occurred')).toBeTruthy();
  });

  it('should call onRetry when Retry button is pressed', () => {
    const mockOnRetry = jest.fn();
    const { getByText } = render(<ErrorView onRetry={mockOnRetry} />);

    fireEvent.press(getByText('Retry'));

    expect(mockOnRetry).toHaveBeenCalledTimes(1);
  });

  it('should not render Retry button when onRetry is not provided', () => {
    const { queryByText } = render(<ErrorView />);

    // Retry button should not be present when onRetry is not provided
    expect(queryByText('Retry')).toBeNull();
  });

  it('should display error icon', () => {
    const { getByText } = render(<ErrorView />);
    expect(getByText('⚠️')).toBeTruthy();
  });
});
