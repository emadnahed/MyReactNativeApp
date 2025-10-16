import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { AppFonts } from '../constants/fonts';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  size = 'large',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color="#FF6B6B" />
      {message && <Text style={styles.message}>{message}</Text>}
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
