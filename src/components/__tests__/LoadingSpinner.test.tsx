import React from 'react';
import { render } from '@testing-library/react-native';
import LoadingSpinner from '../LoadingSpinner';

describe('LoadingSpinner', () => {
  it('should render with default message', () => {
    const { getByText } = render(<LoadingSpinner />);
    expect(getByText('Loading...')).toBeTruthy();
  });

  it('should render with custom message', () => {
    const { getByText } = render(<LoadingSpinner message="Fetching movies..." />);
    expect(getByText('Fetching movies...')).toBeTruthy();
  });

  it('should display loading spinner', () => {
    const { UNSAFE_getByType } = render(<LoadingSpinner />);
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator).toBeDefined();
  });

  it('should use correct spinner color', () => {
    const { UNSAFE_getByType } = render(<LoadingSpinner />);
    const activityIndicator = UNSAFE_getByType(require('react-native').ActivityIndicator);
    expect(activityIndicator.props.color).toBe('#FF6B6B');
  });
});
