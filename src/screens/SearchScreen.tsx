import React, { useCallback, useMemo, useEffect } from 'react';
import {
  View,
  TextInput,
  FlatList,
  StyleSheet,
  Text,
  ListRenderItemInfo,
  ActivityIndicator,
  RefreshControl,
  Keyboard,
  Platform,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSmartMovieSearch, useCachedImages } from '../hooks';
import { getImageUrl } from '../services/tmdb.api';
import MovieCard from '../components/MovieCard';
import SkeletonMovieCard from '../components/SkeletonMovieCard';
import ErrorView from '../components/ErrorView';
import type { Movie } from '../types/movie.types';
import type { SearchScreenProps } from '../types/navigation.types';
import { AppFonts, FontFamilies } from '../constants/fonts';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - 48) / 2; // 2 columns with padding
// Calculate item height: poster (1.5x width) + info container padding (24) + title (36) + meta (20) + margin (16)
const ITEM_HEIGHT = CARD_WIDTH * 1.5 + 96;

const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  // Use smart search hook with automatic API routing
  const {
    movies,
    isLoading,
    error,
    searchQuery,
    setSearchQuery,
    clearSearch,
    loadMore,
    refresh,
    hasMore,
    isSearching,
    queryDescription,
    apiMode,
  } = useSmartMovieSearch({ debounceDelay: 500 });

  const { preloadImages } = useCachedImages();

  // Preload images for better performance
  useEffect(() => {
    if (movies.length > 0) {
      const imageUrls = movies
        .filter(movie => movie.poster_path)
        .map(movie => getImageUrl(movie.poster_path, 'w500'));
      preloadImages(imageUrls, 'normal');
    }
  }, [movies, preloadImages]);

  // Navigate to movie details
  const handleMoviePress = useCallback(
    (movie: Movie) => {
      navigation.navigate('MovieDetails', { movieId: movie.id });
    },
    [navigation]
  );

  // Optimized render item with useCallback
  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Movie>) => (
      <MovieCard movie={item} onPress={handleMoviePress} />
    ),
    [handleMoviePress]
  );

  // Optimized key extractor
  const keyExtractor = useCallback((item: Movie) => item.id.toString(), []);

  // Optimized getItemLayout for better scroll performance
  const getItemLayout = useCallback(
    (_data: ArrayLike<Movie> | null | undefined, index: number) => {
      const rowIndex = Math.floor(index / 2); // 2 columns per row
      return {
        length: ITEM_HEIGHT,
        offset: ITEM_HEIGHT * rowIndex,
        index,
      };
    },
    []
  );

  // Load more movies (pagination)
  const handleLoadMore = useCallback(() => {
    loadMore();
  }, [loadMore]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    refresh();
  }, [refresh]);

  // Footer component for loading more
  const ListFooterComponent = useMemo(() => {
    if (isLoading && movies.length > 0) {
      return (
        <View style={styles.footerLoader}>
          <ActivityIndicator size="small" color="#FF6B6B" />
        </View>
      );
    }
    return null;
  }, [isLoading, movies.length]);

  // Empty component - show skeletons on initial load, empty states otherwise
  const ListEmptyComponent = useMemo(() => {
    if (isLoading && movies.length === 0) {
      // Show skeleton cards on initial load for better UX
      return (
        <View style={styles.skeletonContainer}>
          <View style={styles.skeletonRow}>
            <SkeletonMovieCard />
            <SkeletonMovieCard />
          </View>
          <View style={styles.skeletonRow}>
            <SkeletonMovieCard />
            <SkeletonMovieCard />
          </View>
          <View style={styles.skeletonRow}>
            <SkeletonMovieCard />
            <SkeletonMovieCard />
          </View>
        </View>
      );
    }

    if (isSearching && searchQuery) {
      return (
        <View
          style={styles.emptyContainer}
          accessible={true}
          accessibilityLabel="No movies found"
          accessibilityRole="text"
        >
          <Text style={styles.emptyIcon} accessible={false}>🔍</Text>
          <Text style={styles.emptyText}>No movies found for "{searchQuery}"</Text>
          <Text style={styles.emptySubtext}>Try a different search term</Text>
        </View>
      );
    }

    return (
      <View
        style={styles.emptyContainer}
        accessible={true}
        accessibilityLabel="Search for movies"
        accessibilityRole="text"
      >
        <Text style={styles.emptyIcon} accessible={false}>🎬</Text>
        <Text style={styles.emptyText}>Loading....</Text>
        <Text style={styles.emptySubtext}>Type in the search bar above</Text>
      </View>
    );
  }, [isLoading, isSearching, searchQuery, movies.length]);

  if (error) {
    return (
      <ErrorView
        message="Failed to load movies. Please check your internet connection."
        onRetry={refresh}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right', 'bottom']}>
      {/* Search Bar */}
      <View
        style={styles.searchContainer}
        accessible={true}
        accessibilityLabel="Search movies"
        accessibilityRole="search"
      >
        <Text style={styles.searchIcon} accessible={false}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search movies..."
          placeholderTextColor="#666666"
          value={searchQuery}
          onChangeText={setSearchQuery}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityHint="Type to search for movies"
        />
        {searchQuery.length > 0 && (
          <Text
            style={styles.clearButton}
            onPress={clearSearch}
            accessible={true}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            accessibilityHint="Double tap to clear search text">
            ✕
          </Text>
        )}
      </View>

      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>
          {isSearching ? 'Search Results' : 'Popular Movies'}
        </Text>
        {__DEV__ && isSearching && (
          <Text style={styles.debugText}>
            Mode: {apiMode.toUpperCase()} • {queryDescription}
          </Text>
        )}
      </View>

      {/* Movies List */}
      <FlatList
        testID="movie-list"
        data={movies}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        getItemLayout={getItemLayout}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={handleRefresh}
            tintColor="#b0fe76"
            colors={['#b0fe76']}
          />
        }
        // Performance optimizations
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        updateCellsBatchingPeriod={50}
        initialNumToRender={10}
        windowSize={21}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E1E1E',
    marginHorizontal: 16,    
    marginVertical: 22,    
    paddingHorizontal: 16,
    paddingVertical: Platform.OS === 'ios' ? 12 : 2,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize:16,
    fontFamily: FontFamilies.Albra.RegularItalic,
  },
  clearButton: {
    color: '#666666',
    fontSize: 20,
    padding: 4,
  },
  headerContainer: {
    marginHorizontal: 16,
    marginBottom: 22,
  },
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: FontFamilies.Gilroy.Bold,
  },
  debugText: {
    color: '#666666',
    fontSize: 10,
    fontFamily: FontFamilies.Albra.RegularItalic,
    marginTop: 4,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    flexGrow: 1,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: 0,
  },
  footerLoader: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: AppFonts.display.semiBold,
    marginBottom: 8,
  },
  emptySubtext: {
    color: '#666666',
    fontSize: 14,
    fontFamily: AppFonts.body.regular,
  },
  skeletonContainer: {
    width: '100%',
  },
  skeletonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 0,
  },
});

export default SearchScreen;
