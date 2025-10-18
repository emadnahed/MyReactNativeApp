/**
 * MovieCard Component
 *
 * Displays a movie poster card with title, rating, and year.
 * Optimized with React.memo for performance in large lists.
 *
 * @component
 * @example
 * ```tsx
 * <MovieCard
 *   movie={movieData}
 *   onPress={(movie) => navigate('Details', { movieId: movie.id })}
 * />
 * ```
 */

import React, { memo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import type { Movie } from '../types/movie.types';
import { getImageUrl } from '../services/tmdb.api';
import { AppFonts, FontFamilies } from '../constants/fonts';

/**
 * Props for the MovieCard component
 */
interface MovieCardProps {
  /** Movie data from TMDb API */
  movie: Movie;
  /** Optional callback when card is pressed */
  onPress?: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
/** Card width for 2-column grid layout */
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

/**
 * Movie card component with poster, title, rating and year
 * Memoized to prevent unnecessary re-renders
 */
const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const handlePress = () => {
    onPress?.(movie);
  };

  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
  const rating = movie.vote_average.toFixed(1);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="movie-card"
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.7}
        accessible={true}
        accessibilityLabel={`${movie.title}, rating ${rating} stars, released ${year}`}
        accessibilityRole="button"
        accessibilityHint="Double tap to view movie details">
        <FastImage
          source={{
            uri: getImageUrl(movie.poster_path, 'w500'),
            priority: FastImage.priority.normal,
          }}
          style={styles.poster}
          resizeMode={FastImage.resizeMode.cover}
          accessible={false}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail" accessible={false}>
            {movie.title}
          </Text>
          <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating} accessible={false}>
              {rating}
            </Text>
            <Text style={styles.ratingIcon} accessible={false}> ★</Text>
          </View>
          <Text style={styles.year} accessible={false}>
            {year}
          </Text>
        </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    marginBottom: 16,
  },
  card: {
    flex: 1,
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 4,
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
    }),
  },
  poster: {
    width: '100%',
    height: CARD_WIDTH * 1.5,
    backgroundColor: '#2A2A2A',
  },
  infoContainer: {
    padding: 12,
    paddingTop: 10,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FontFamilies.Gilroy.Bold,
    marginBottom: 8,
    lineHeight: 18,
    minHeight: 36,
    includeFontPadding: false,
    textAlignVertical: 'top',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',    
    marginBottom: 4,
  },
  rating: {
    color: '#FFD700',
    fontSize: 14,
    fontFamily: FontFamilies.Gilroy.Medium,
  },
  ratingIcon: {
    color: '#FFD700',
    fontSize: 14,
  },
  year: {
    color: '#999999',
    fontSize: 12,
    fontFamily: AppFonts.body.regular,
    marginTop: 2,
  },
});

// Memoize with custom comparison
export default memo(MovieCard, (prevProps, nextProps) => {
  return prevProps.movie.id === nextProps.movie.id;
});
