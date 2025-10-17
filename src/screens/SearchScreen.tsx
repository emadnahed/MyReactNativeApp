import React, { useState, useCallback, useMemo } from 'react';
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
import { useSearchMoviesQuery, useGetPopularMoviesQuery } from '../services/tmdb.api';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
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
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search query
  const debounceTimer = React.useRef<NodeJS.Timeout>();

  const handleSearchChange = useCallback((text: string) => {
    setSearchQuery(text);

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedQuery(text);
      setPage(1);
    }, 500);
  }, []);

  // Use search query if available, otherwise show popular movies
  const shouldSearch = debouncedQuery.trim().length > 0;

  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMoviesQuery(
    { query: debouncedQuery, page },
    { skip: !shouldSearch }
  );

  const {
    data: popularData,
    isLoading: isPopularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = useGetPopularMoviesQuery(page, { skip: shouldSearch });

  const data = shouldSearch ? searchData : popularData;
  const isLoading = shouldSearch ? isSearchLoading : isPopularLoading;
  const error = shouldSearch ? searchError : popularError;
  const refetch = shouldSearch ? refetchSearch : refetchPopular;

  const movies = useMemo(() => data?.results || [], [data]);
  const totalPages = data?.total_pages || 0;

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
    if (!isLoading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, page, totalPages]);

  // Pull to refresh
  const handleRefresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

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

    if (shouldSearch && debouncedQuery) {
      return (
        <View
          style={styles.emptyContainer}
          accessible={true}
          accessibilityLabel="No movies found"
          accessibilityRole="text"
        >
          <Text style={styles.emptyIcon} accessible={false}>🔍</Text>
          <Text style={styles.emptyText}>No movies found for "{debouncedQuery}"</Text>
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
        <Text style={styles.emptyText}>Search for movies</Text>
        <Text style={styles.emptySubtext}>Type in the search bar above</Text>
      </View>
    );
  }, [isLoading, shouldSearch, debouncedQuery, movies.length]);

  if (error) {
    return (
      <ErrorView
        message="Failed to load movies. Please check your internet connection."
        onRetry={refetch}
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
          onChangeText={handleSearchChange}
          returnKeyType="search"
          onSubmitEditing={Keyboard.dismiss}
          accessible={true}
          accessibilityLabel="Search input"
          accessibilityHint="Type to search for movies"
        />
        {searchQuery.length > 0 && (
          <Text
            style={styles.clearButton}
            onPress={() => {
              setSearchQuery('');
              setDebouncedQuery('');
              setPage(1);
            }}
            accessible={true}
            accessibilityLabel="Clear search"
            accessibilityRole="button"
            accessibilityHint="Double tap to clear search text">
            ✕
          </Text>
        )}
      </View>

      {/* Header */}
      <Text style={styles.header}>
        {shouldSearch ? 'Search Results' : 'Popular Movies'}
      </Text>

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
  header: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: FontFamilies.Gilroy.Bold,
    marginHorizontal: 16,
    // marginVertical: 12,
    marginBottom: 22,
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
