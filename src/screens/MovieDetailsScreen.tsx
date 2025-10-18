import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import FastImage from 'react-native-fast-image';
import { useGetMovieDetailsQuery } from '../services/tmdb.api';
import { getImageUrl } from '../services/tmdb.api';
import ErrorView from '../components/ErrorView';
import { AppFonts, FontFamilies } from '../constants/fonts';
import type { MovieDetailsScreenProps } from '../types/navigation.types';
import { useDispatch } from 'react-redux';
import { setCurrentMovieTitle } from '../store/movieSlice';

const { width, height } = Dimensions.get('window');
const BACKDROP_HEIGHT = height * 0.4;

const MovieDetailsScreen: React.FC<MovieDetailsScreenProps> = ({ route }) => {
  const { movieId } = route.params;
  const { data: movie, isLoading, error, refetch } = useGetMovieDetailsQuery(movieId);
  const dispatch = useDispatch();

  // Set the movie title in Redux when movie data is loaded
  useEffect(() => {
    if (movie?.title) {
      dispatch(setCurrentMovieTitle(movie.title));
    }
  }, [movie?.title, dispatch]);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#b0fe76" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <ErrorView
        message="Failed to load movie details. Please try again."
        onRetry={refetch}
      />
    );
  }

  const formatRuntime = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatMoney = (amount: number) => {
    if (!amount) return 'N/A';
    return `$${(amount / 1000000).toFixed(1)}M`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView testID="movie-details-screen" showsVerticalScrollIndicator={false}>
        {/* Backdrop Image */}
        <View style={styles.backdropContainer}>
          <FastImage
            source={{
              uri: getImageUrl(movie.backdrop_path || movie.poster_path, 'original'),
              priority: FastImage.priority.high,
            }}
            style={styles.backdrop}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{movie.title}</Text>
            {movie.tagline ? (
              <Text style={styles.tagline}>"{movie.tagline}"</Text>
            ) : null}
          </View>

          {/* Meta Info */}
          <View style={styles.metaContainer}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Rating</Text>
              <View style={styles.ratingContainer}>
                <Text style={styles.rating}>{movie.vote_average.toFixed(1)}</Text>
                <Text style={styles.ratingIcon}> ★</Text>
              </View>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Year</Text>
              <Text style={styles.metaValue}>
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
              </Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Duration</Text>
              <Text style={styles.metaValue}>{formatRuntime(movie.runtime)}</Text>
            </View>
          </View>

          {/* Genres */}
          {movie.genres && movie.genres.length > 0 && (
            <View style={styles.genresContainer}>
              {movie.genres.map((genre) => (
                <View key={genre.id} style={styles.genreChip}>
                  <Text style={styles.genreText}>{genre.name}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <Text style={styles.overview}>{movie.overview || 'No overview available.'}</Text>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Info</Text>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Status</Text>
              <Text style={styles.infoValue}>{movie.status}</Text>
            </View>

            {movie.budget > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Budget</Text>
                <Text style={styles.infoValue}>{formatMoney(movie.budget)}</Text>
              </View>
            )}

            {movie.revenue > 0 && (
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Revenue</Text>
                <Text style={styles.infoValue}>{formatMoney(movie.revenue)}</Text>
              </View>
            )}

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Original Language</Text>
              <Text style={styles.infoValue}>{movie.original_language.toUpperCase()}</Text>
            </View>

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Popularity</Text>
              <Text style={styles.infoValue}>{movie.popularity.toFixed(0)}</Text>
            </View>
          </View>

          {/* Production Companies */}
          {movie.production_companies && movie.production_companies.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Production Companies</Text>
              {movie.production_companies.map((company) => (
                <Text key={company.id} style={styles.companyText}>
                  • {company.name}
                </Text>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: AppFonts.body.regular,
    marginTop: 12,
  },
  backdropContainer: {
    height: BACKDROP_HEIGHT,
    width: width,
  },
  backdrop: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  titleSection: {
    marginBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontFamily: FontFamilies.Gilroy.Bold,
    marginBottom: 8,
    lineHeight: 34,
  },
  tagline: {
    color: '#999999',
    fontSize: 16,
    fontFamily: FontFamilies.Albra.RegularItalic,
    lineHeight: 22,
  },
  metaContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  metaItem: {
    alignItems: 'center',
    flex: 1,
  },
  metaDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#333333',
  },
  metaLabel: {
    color: '#999999',
    fontSize: 12,
    fontFamily: AppFonts.body.regular,
    marginBottom: 4,
  },
  metaValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: FontFamilies.Gilroy.Medium,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    color: '#FFD700',
    fontSize: 18,
    fontFamily: FontFamilies.Gilroy.Bold,
  },
  ratingIcon: {
    color: '#FFD700',
    fontSize: 18,
  },
  genresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 24,
    gap: 8,
  },
  genreChip: {
    backgroundColor: '#2A2A2A',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#3A3A3A',
  },
  genreText: {
    color: '#b0fe76',
    fontSize: 13,
    fontFamily: FontFamilies.Gilroy.Medium,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: FontFamilies.Gilroy.Bold,
    marginBottom: 12,
  },
  overview: {
    color: '#CCCCCC',
    fontSize: 15,
    fontFamily: AppFonts.body.regular,
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
  },
  infoLabel: {
    color: '#999999',
    fontSize: 14,
    fontFamily: AppFonts.body.regular,
  },
  infoValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: FontFamilies.Gilroy.Medium,
  },
  companyText: {
    color: '#CCCCCC',
    fontSize: 14,
    fontFamily: AppFonts.body.regular,
    marginBottom: 8,
    lineHeight: 20,
  },
});

export default MovieDetailsScreen;
