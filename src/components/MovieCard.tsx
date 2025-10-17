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

interface MovieCardProps {
  movie: Movie;
  onPress?: (movie: Movie) => void;
}

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding

const MovieCard: React.FC<MovieCardProps> = ({ movie, onPress }) => {
  const handlePress = () => {
    onPress?.(movie);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        testID="movie-card"
        style={styles.card}
        onPress={handlePress}
        activeOpacity={0.7}>
        <FastImage
          source={{
            uri: getImageUrl(movie.poster_path, 'w500'),
            priority: FastImage.priority.normal,
          }}
          style={styles.poster}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={styles.infoContainer}>
          <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
            {movie.title}
          </Text>
          <View style={{flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>
              {movie.vote_average.toFixed(1)}
            </Text>
            <Text style={styles.ratingIcon}> ★</Text>
          </View>
          <Text style={styles.year}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
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
