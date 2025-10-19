/**
 * useMovieSearch Hook
 *
 * A comprehensive hook for searching and browsing movies with built-in debouncing,
 * pagination, and automatic switching between search and popular movies.
 *
 * @example
 * ```tsx
 * const {
 *   movies,
 *   isLoading,
 *   error,
 *   searchQuery,
 *   setSearchQuery,
 *   clearSearch,
 *   loadMore,
 *   refresh,
 *   hasMore,
 * } = useMovieSearch();
 * ```
 */

import { useState, useCallback, useMemo } from 'react';
import { useSearchMoviesQuery, useGetPopularMoviesQuery } from '../services/tmdb.api';
import { useDebounce } from './useDebounce';
import type { Movie } from '../types/movie.types';

interface UseMovieSearchResult {
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
  /** Whether currently showing search results or popular movies */
  isSearching: boolean;
}

/**
 * Custom hook for movie search with debouncing and pagination
 */
export function useMovieSearch(debounceDelay: number = 500): UseMovieSearchResult {
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);

  // Debounce the search query to avoid excessive API calls
  const debouncedQuery = useDebounce(searchQuery, debounceDelay);

  // Determine if we should search or show popular movies
  const isSearching = debouncedQuery.trim().length > 0;

  // Search movies query
  const {
    data: searchData,
    isLoading: isSearchLoading,
    error: searchError,
    refetch: refetchSearch,
  } = useSearchMoviesQuery(
    { query: debouncedQuery, page },
    { skip: !isSearching }
  );

  // Popular movies query
  const {
    data: popularData,
    isLoading: isPopularLoading,
    error: popularError,
    refetch: refetchPopular,
  } = useGetPopularMoviesQuery(page, { skip: isSearching });

  // Select the appropriate data based on search state
  const data = isSearching ? searchData : popularData;
  const isLoading = isSearching ? isSearchLoading : isPopularLoading;
  const error = isSearching ? searchError : popularError;
  const refetch = isSearching ? refetchSearch : refetchPopular;

  // Memoized movies array
  const movies = useMemo(() => data?.results || [], [data]);
  const totalPages = data?.total_pages || 0;
  const hasMore = page < totalPages;

  // Clear search and reset to popular movies
  const clearSearch = useCallback(() => {
    setSearchQuery('');
    setPage(1);
  }, []);

  // Load more movies (pagination)
  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [isLoading, hasMore]);

  // Refresh current results
  const refresh = useCallback(() => {
    setPage(1);
    refetch();
  }, [refetch]);

  // Update search query and reset page
  const handleSetSearchQuery = useCallback((query: string) => {
    setSearchQuery(query);
    setPage(1);
  }, []);

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
  };
}

export default useMovieSearch;
