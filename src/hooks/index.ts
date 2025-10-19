/**
 * Custom Hooks
 *
 * Centralized export of all custom hooks for easy imports.
 */

import { useDebounce } from './useDebounce';
import { useMovieSearch } from './useMovieSearch';
import { useCachedImages } from './useCachedImages';
import { usePerformanceMonitor } from './usePerformanceMonitor';
import { useSmartMovieSearch } from './useSmartMovieSearch';

export { useDebounce, useMovieSearch, useCachedImages, usePerformanceMonitor, useSmartMovieSearch };

export default {
  useDebounce,
  useMovieSearch,
  useCachedImages,
  usePerformanceMonitor,
  useSmartMovieSearch,
};
