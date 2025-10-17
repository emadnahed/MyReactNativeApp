/**
 * ErrorView Component
 *
 * Displays an error state with an optional retry button.
 * Provides user feedback when API calls or operations fail.
 *
 * @component
 * @example
 * ```tsx
 * <ErrorView
 *   message="Failed to load data"
 *   onRetry={() => refetch()}
 * />
 * ```
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AppFonts } from '../constants/fonts';

/**
 * Props for the ErrorView component
 */
interface ErrorViewProps {
  /** Error message to display. Defaults to "Something went wrong" */
  message?: string;
  /** Optional callback function to retry the failed operation */
  onRetry?: () => void;
}

/**
 * Error view component with message and optional retry button
 */
const ErrorView: React.FC<ErrorViewProps> = ({
  message = 'Something went wrong',
  onRetry,
}) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={`Error: ${message}`}
      accessibilityRole="alert"
    >
      <Text style={styles.errorIcon} accessible={false}>⚠️</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity
          style={styles.retryButton}
          onPress={onRetry}
          accessible={true}
          accessibilityLabel="Retry"
          accessibilityRole="button"
          accessibilityHint="Double tap to retry loading"
        >
          <Text style={styles.retryText} accessible={false}>Retry</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
    padding: 20,
  },
  errorIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  message: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: AppFonts.body.regular,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: AppFonts.ui.semiBold,
  },
});

export default ErrorView;
