/**
 * PerformanceOverlay Component
 *
 * Displays real-time performance metrics in development mode:
 * - FPS (Frames Per Second)
 * - Memory usage
 * - Performance warnings
 *
 * Only visible in __DEV__ mode.
 *
 * @example
 * ```tsx
 * // In App.tsx or root component
 * {__DEV__ && <PerformanceOverlay />}
 * ```
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { usePerformanceMonitor } from '../hooks/usePerformanceMonitor';

interface PerformanceOverlayProps {
  /** Position on screen */
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  /** Whether to show by default */
  defaultVisible?: boolean;
}

const PerformanceOverlay: React.FC<PerformanceOverlayProps> = ({
  position = 'top-right',
  defaultVisible = true,
}) => {
  const [visible, setVisible] = useState(defaultVisible);
  const { fps, startMonitoring, stopMonitoring } = usePerformanceMonitor('PerformanceOverlay', {
    autoStart: true,
  });

  useEffect(() => {
    startMonitoring();
    return () => stopMonitoring();
  }, [startMonitoring, stopMonitoring]);

  // Only show in development mode
  if (!__DEV__) {
    return null;
  }

  if (!visible) {
    return (
      <TouchableOpacity
        style={[styles.minimizedContainer, getPositionStyles(position)]}
        onPress={() => setVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.minimizedText}>📊</Text>
      </TouchableOpacity>
    );
  }

  // Determine FPS color based on performance
  const getFPSColor = (currentFps: number): string => {
    if (currentFps >= 55) return '#00FF00'; // Green - Excellent
    if (currentFps >= 45) return '#FFFF00'; // Yellow - Good
    if (currentFps >= 30) return '#FFA500'; // Orange - Fair
    return '#FF0000'; // Red - Poor
  };

  return (
    <View style={[styles.container, getPositionStyles(position)]}>
      <View style={styles.header}>
        <Text style={styles.title}>Performance</Text>
        <TouchableOpacity
          onPress={() => setVisible(false)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        {/* FPS Display */}
        <View style={styles.metricRow}>
          <Text style={styles.metricLabel}>FPS:</Text>
          <Text style={[styles.metricValue, { color: getFPSColor(fps) }]}>
            {fps > 0 ? fps : '--'}
          </Text>
        </View>

        {/* Performance Status */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusIndicator,
              { backgroundColor: getFPSColor(fps) },
            ]}
          />
          <Text style={styles.statusText}>
            {fps >= 55 && 'Excellent'}
            {fps >= 45 && fps < 55 && 'Good'}
            {fps >= 30 && fps < 45 && 'Fair'}
            {fps > 0 && fps < 30 && 'Poor'}
            {fps === 0 && 'Starting...'}
          </Text>
        </View>
      </View>
    </View>
  );
};

// Helper function to get position styles
const getPositionStyles = (
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
) => {
  const styles: any = {
    position: 'absolute',
  };

  switch (position) {
    case 'top-left':
      styles.top = 50;
      styles.left = 10;
      break;
    case 'top-right':
      styles.top = 50;
      styles.right = 10;
      break;
    case 'bottom-left':
      styles.bottom = 50;
      styles.left = 10;
      break;
    case 'bottom-right':
      styles.bottom = 50;
      styles.right = 10;
      break;
  }

  return styles;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 8,
    padding: 12,
    minWidth: 140,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  minimizedContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  minimizedText: {
    fontSize: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  closeButton: {
    color: '#999999',
    fontSize: 16,
    fontWeight: '700',
  },
  content: {
    gap: 8,
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metricLabel: {
    color: '#CCCCCC',
    fontSize: 11,
    fontWeight: '600',
  },
  metricValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  statusText: {
    color: '#CCCCCC',
    fontSize: 10,
    fontWeight: '600',
  },
});

export default PerformanceOverlay;
