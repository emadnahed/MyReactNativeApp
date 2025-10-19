/**
 * useSmartMovieSearch Hook
 *
 * Intelligent movie search that automatically uses the best TMDb API endpoint:
 * - Simple text queries → Search API
 * - Complex queries with filters → Discover API
 * - Empty query → Popular Movies API
 *
 * @example
 * ```tsx
 * const {
 *   movies,
 *   isLoading,
 *   searchQuery,
 *   setSearchQuery,
 *   queryDescription,
 * } = useSmartMovieSearch();
 *
 * // User types "action 2020 rating>7"
 * // Automatically uses Discover API with filters!
 * ```
 */

import { useState, useCallback, useMemo, useEffect } from 'react';
import {
  useSearchMoviesQuery,
  useGetPopularMoviesQuery,
  useDiscoverMoviesQuery,
} from '../services/tmdb.api';
import { useDebounce } from './useDebounce';
import { parseSearchQuery, toDiscoverParams, getQueryDescription } from '../utils/queryParser';
import type { Movie } from '../types/movie.types';

interface UseSmartMovieSearchOptions {
  debounceDelay?: number;
}

interface UseSmartMovieSearchResult {
  /** The filtered/searched movies */
  movies: Movie[];
  /** Loading state */
  isLoading: boolean;
  /** Error state */
  error: any;
  /** Current search query */
  searchQuery: string;
  /** Update search query */
  setSearchQuery: (query: string) => void;
  /** Clear search and reset to popular movies */
  clearSearch: () => void;
  /** Load more movies (pagination) */
  loadMore: () => void;
  /** Refresh current results */
  refresh: () => void;
  /** Whether more results are available */
  hasMore: boolean;
  /** Total number of pages available */
  totalPages: number;
  /** Current page number */
  currentPage: number;
  /** Whether currently showing search/discover results */
  isSearching: boolean;
  /** Human-readable description of current search */
  queryDescription: string;
  /** Which API endpoint is being used */
  apiMode: 'popular' | 'search' | 'discover';
}

/**
 * Smart movie search with automatic API routing
 */
export function useSmartMovieSearch(
  options: UseSmartMovieSearchOptions = {}
): UseSmartMovieSearchResult {
  const { debounceDelay = 500 } = options;

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [accumulatedMovies, setAccumulatedMovies] = useState<Movie[]>([]);

  // Debounce the search query
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  // Parse the query to determine which API to use
  const parsedQuery = useMemo(
    () => parseSearchQuery(debouncedQuery),
    [debouncedQuery]
  );

  // Determine API mode
  const apiMode: 'popular' | 'search' | 'discover' = useMemo(() => {
    if (!debouncedQuery.trim()) {
      return 'popular';
    }
    if (parsedQuery.useDiscover) {
      return 'discover';
    }
    return 'search';
  }, [debouncedQuery, parsedQuery.useDiscover]);

  // Popular Movies Query
  const {
    data: popularData,
    isLoading: isPopularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = useGetPopularMoviesQuery(page, {
    skip: apiMode !== 'popular',
  });

  // Search API Query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMoviesQuery(
    { query: parsedQuery.textQuery || debouncedQuery, page },
    {
      skip: apiMode !== 'search',
    }
  );

  // Discover API Query
  const discoverParams = useMemo(
    () => ({
      ...toDiscoverParams(parsedQuery),
      page,
    }),
    [parsedQuery, page]
  );

  const {
    data: discoverData,
    isLoading: isDiscoverLoading,
    error: discoverError,
    refetch: refetchDiscover,
  } = useDiscoverMoviesQuery(discoverParams, {
    skip: apiMode !== 'discover',
  });

  // Select the appropriate data based on API mode
  const data = useMemo(() => {
    switch (apiMode) {
      case 'popular':
        return popularData;
      case 'search':
        return searchData;
      case 'discover':
        return discoverData;
      default:
        return undefined;
    }
  }, [apiMode, popularData, searchData, discoverData]);

  const isLoading = useMemo(() => {
    switch (apiMode) {
      case 'popular':
        return isPopularLoading;
      case 'search':
        return isSearchLoading;
      case 'discover':
        return isDiscoverLoading;
      default:
        return false;
    }
  }, [apiMode, isPopularLoading, isSearchLoading, isDiscoverLoading]);

  const error = useMemo(() => {
    switch (apiMode) {
      case 'popular':
        return popularError;
      case 'search':
        return searchError;
      case 'discover':
        return discoverError;
      default:
        return undefined;
    }
  }, [apiMode, popularError, searchError, discoverError]);

  const refetch = useCallback(() => {
    switch (apiMode) {
      case 'popular':
        refetchPopular();
        break;
      case 'search':
        refetchSearch();
        break;
      case 'discover':
        refetchDiscover();
        break;
    }
  }, [apiMode, refetchPopular, refetchSearch, refetchDiscover]);

  // Accumulate movies when new data arrives
  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        // First page: replace all movies
        setAccumulatedMovies(data.results);
      } else {
        // Subsequent pages: append to existing movies
        setAccumulatedMovies(prev => {
          // Avoid duplicates by filtering out movies with existing IDs
          const existingIds = new Set(prev.map(m => m.id));
          const newMovies = data.results.filter(m => !existingIds.has(m.id));
          return [...prev, ...newMovies];
        });
      }
    }
  }, [data, page]);

  // Reset accumulated movies when query or API mode changes
  useEffect(() => {
    setAccumulatedMovies([]);
    setPage(1);
  }, [debouncedQuery, apiMode]);

  // Memoized movies array
  const movies = accumulatedMovies;
  const totalPages = data?.total_pages || 0;
  const hasMore = page < totalPages;
  const isSearching = apiMode !== 'popular';

  // Query description for UI feedback
  const queryDescription = useMemo(
    () => getQueryDescription(parsedQuery),
    [parsedQuery]
  );

  // Clear search and reset
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setPage(1);
    setAccumulatedMovies([]);
  }, []);

  // Load more movies (pagination)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Refresh current results
  const refresh = useCallback(() => {
    setPage(1);
    setAccumulatedMovies([]);
    refetch();
  }, [refetch]);

  // Update search query and reset page
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
    setAccumulatedMovies([]);
  }, []);

  // Log API mode changes in development
  useEffect(() => {
    if (__DEV__ && debouncedQuery) {
      console.log(`🔍 Smart Search Mode: ${apiMode.toUpperCase()}`);
      console.log(`📝 Query Description: ${queryDescription}`);
    }
  }, [apiMode, queryDescription, debouncedQuery]);

  return {
    movies,
    isLoading,
    error,
    searchQuery,
    setSearchQuery: handleSetSearchQuery,
    clearSearch,
    loadMore,
    refresh,
    hasMore,
    totalPages,
    currentPage: page,
    isSearching,
    queryDescription,
    apiMode,
  };
}

export default useSmartMovieSearch;
