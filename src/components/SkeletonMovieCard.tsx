/**
 * SkeletonMovieCard Component
 *
 * A skeleton loader that mimics the MovieCard component structure
 * to provide visual feedback while content is loading.
 *
 * @component
 * @example
 * ```tsx
 * <SkeletonMovieCard />
 * ```
 */

import React, { useEffect, useRef, useState } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';

// Calculate card width dynamically to avoid Jest issues with module-level Dimensions.get()
const getCardWidth = () => {
  const { width } = Dimensions.get('window');
  return (width - 48) / 2;
};

/**
 * Skeleton loading card that animates to show loading state
 */
const SkeletonMovieCard: React.FC = () => {
  const [cardWidth] = useState(getCardWidth());
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Create infinite shimmer animation
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );

    animation.start();

    return () => animation.stop();
  }, [shimmerAnim]);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  const styles = createStyles(cardWidth);

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Poster skeleton */}
        <Animated.View style={[styles.poster, { opacity }]} />

        {/* Info skeleton */}
        <View style={styles.infoContainer}>
          <Animated.View style={[styles.titleSkeleton, { opacity }]} />
          <View style={styles.metaRow}>
            <Animated.View style={[styles.ratingSkeleton, { opacity }]} />
            <Animated.View style={[styles.yearSkeleton, { opacity }]} />
          </View>
        </View>
      </View>
    </View>
  );
};

const createStyles = (cardWidth: number) => StyleSheet.create({
  container: {
    width: cardWidth,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
  },
  poster: {
    width: '100%',
    height: cardWidth * 1.5,
    backgroundColor: '#2A2A2A',
  },
  infoContainer: {
    padding: 12,
    paddingTop: 10,
  },
  titleSkeleton: {
    height: 36,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingSkeleton: {
    width: 40,
    height: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
  },
  yearSkeleton: {
    width: 50,
    height: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 4,
  },
});

export default SkeletonMovieCard;
