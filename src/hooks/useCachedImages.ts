/**
 * useCachedImages Hook
 *
 * Provides utilities for preloading and managing cached images using FastImage.
 * Useful for optimizing image loading performance in lists and galleries.
 *
 * @example
 * ```tsx
 * const { preloadImages, clearCache, getCacheSize } = useCachedImages();
 *
 * // Preload images for better performance
 * useEffect(() => {
 *   const imageUrls = movies.map(m => getImageUrl(m.poster_path));
 *   preloadImages(imageUrls);
 * }, [movies]);
 * ```
 */

import { useCallback, useEffect, useState } from 'react';
import FastImage from 'react-native-fast-image';

interface ImageSource {
  uri: string;
  priority?: 'low' | 'normal' | 'high';
  cache?: 'immutable' | 'web' | 'cacheOnly';
}

interface UseCachedImagesResult {
  /** Preload an array of image URLs */
  preloadImages: (urls: string[], priority?: 'low' | 'normal' | 'high') => Promise<void>;
  /** Clear the entire image cache */
  clearCache: () => Promise<void>;
  /** Get cache statistics (if available) */
  getCacheSize: () => Promise<string>;
  /** Whether images are currently being preloaded */
  isPreloading: boolean;
  /** Error during preloading, if any */
  preloadError: Error | null;
}

/**
 * Custom hook for managing cached images with FastImage
 */
export function useCachedImages(): UseCachedImagesResult {
  const [isPreloading, setIsPreloading] = useState(false);
  const [preloadError, setPreloadError] = useState<Error | null>(null);

  /**
   * Preload multiple images into cache
   */
  const preloadImages = useCallback(
    async (urls: string[], priority: 'low' | 'normal' | 'high' = 'normal') => {
      if (!urls || urls.length === 0) {
        return;
      }

      setIsPreloading(true);
      setPreloadError(null);

      try {
        // Filter out invalid URLs
        const validUrls = urls.filter(url => url && typeof url === 'string' && url.trim() !== '');

        // Create image sources with priority
        const sources: ImageSource[] = validUrls.map(uri => ({
          uri,
          priority: FastImage.priority[priority],
          cache: FastImage.cacheControl.immutable,
        }));

        // Preload all images
        await FastImage.preload(sources);
      } catch (error) {
        console.error('Error preloading images:', error);
        setPreloadError(error as Error);
      } finally {
        setIsPreloading(false);
      }
    },
    []
  );

  /**
   * Clear the entire FastImage cache
   */
  const clearCache = useCallback(async () => {
    try {
      await FastImage.clearDiskCache();
      await FastImage.clearMemoryCache();
      console.log('Image cache cleared successfully');
    } catch (error) {
      console.error('Error clearing image cache:', error);
      throw error;
    }
  }, []);

  /**
   * Get cache size information
   * Note: FastImage doesn't provide a direct API for this,
   * so this is a placeholder that returns a message
   */
  const getCacheSize = useCallback(async (): Promise<string> => {
    // FastImage doesn't provide cache size API
    // This is a placeholder for future implementation
    return 'Cache size information not available';
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      // Optional: Clear cache on unmount if needed
      // FastImage.clearMemoryCache();
    };
  }, []);

  return {
    preloadImages,
    clearCache,
    getCacheSize,
    isPreloading,
    preloadError,
  };
}

export default useCachedImages;
