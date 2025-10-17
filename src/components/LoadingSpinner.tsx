/**
 * LoadingSpinner Component
 *
 * A reusable loading indicator with customizable message and size.
 * Used throughout the app to indicate loading states.
 *
 * @component
 * @example
 * ```tsx
 * <LoadingSpinner message="Loading movies..." size="large" />
 * ```
 */

import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { AppFonts } from '../constants/fonts';

/**
 * Props for the LoadingSpinner component
 */
interface LoadingSpinnerProps {
  /** Loading message to display. Defaults to "Loading..." */
  message?: string;
  /** Size of the spinner. Defaults to "large" */
  size?: 'small' | 'large';
}

/**
 * Loading spinner with optional message
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <View
      style={styles.container}
      accessible={true}
      accessibilityLabel={message}
      accessibilityRole="progressbar"
    >
      <ActivityIndicator size={size} color="#FF6B6B" accessible={false} />
      {message && <Text style={styles.message} accessible={false}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  message: {
    marginTop: 16,
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: AppFonts.body.regular,
  },
});

export default LoadingSpinner;
