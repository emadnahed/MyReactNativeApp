/**
 * Smart Query Parser
 *
 * Parses user search input and extracts structured filters for Discover API.
 * Intelligently detects years, ratings, genres, and other criteria.
 *
 * @example
 * parseSearchQuery("action 2020 rating>7")
 * // Returns: {
 * //   textQuery: undefined,
 * //   year: 2020,
 * //   minRating: 7,
 * //   genres: [28],  // Action
 * //   useDiscover: true
 * // }
 */

import { findGenresInText } from '../constants/genres';
import type { ParsedSearchQuery, DiscoverMovieParams } from '../types/discover.types';

/**
 * Parse user search query into structured filters
 */
export function parseSearchQuery(query: string): ParsedSearchQuery {
  if (!query || !query.trim()) {
    return { useDiscover: false };
  }

  const result: ParsedSearchQuery = {
    useDiscover: false,
  };

  let remainingText = query.trim();

  // 1. Extract Year (matches 4-digit years from 1900-2099)
  const yearPattern = /\b(19|20)\d{2}\b/g;
  const yearMatches = remainingText.match(yearPattern);
  if (yearMatches && yearMatches.length > 0) {
    result.year = parseInt(yearMatches[0], 10);
    remainingText = remainingText.replace(yearPattern, '').trim();
    result.useDiscover = true;
  }

  // 2. Extract Rating Filters
  // Patterns: "rating>7", "rating>=8", "rating 7+", ">7", "7+"
  const ratingPatterns = [
    /rating\s*[>>=]+\s*(\d+\.?\d*)/i,
    /[>>=]+\s*(\d+\.?\d*)\s*rating/i,
    /(\d+\.?\d*)\s*\+/,
    /[>>=]\s*(\d+\.?\d*)/,
  ];

  for (const pattern of ratingPatterns) {
    const match = remainingText.match(pattern);
    if (match) {
      result.minRating = parseFloat(match[1]);
      remainingText = remainingText.replace(pattern, '').trim();
      result.useDiscover = true;
      break; // Only match first rating pattern
    }
  }

  // 3. Extract Runtime Filters
  // Patterns: "longer than 120", "runtime>90", ">2 hours"
  const runtimePatterns = [
    /runtime\s*[>>=]+\s*(\d+)/i,
    /longer\s+than\s+(\d+)/i,
    /[>>=]\s*(\d+)\s*min/i,
  ];

  for (const pattern of runtimePatterns) {
    const match = remainingText.match(pattern);
    if (match) {
      result.minRuntime = parseInt(match[1], 10);
      remainingText = remainingText.replace(pattern, '').trim();
      result.useDiscover = true;
      break;
    }
  }

  // 4. Extract Genres from remaining text
  const foundGenres = findGenresInText(remainingText);
  if (foundGenres.length > 0) {
    result.genres = foundGenres.map(String);
    result.useDiscover = true;

    // Remove genre keywords from text
    // This is a simplified approach - remove common genre words
    const genreWords = [
      'action',
      'adventure',
      'animation',
      'comedy',
      'crime',
      'documentary',
      'drama',
      'family',
      'fantasy',
      'history',
      'horror',
      'music',
      'mystery',
      'romance',
      'sci-fi',
      'science fiction',
      'thriller',
      'war',
      'western',
    ];

    genreWords.forEach(word => {
      const regex = new RegExp(`\\b${word}\\b`, 'gi');
      remainingText = remainingText.replace(regex, '').trim();
    });
  }

  // 5. Remaining text becomes the title query
  remainingText = remainingText.replace(/\s+/g, ' ').trim();
  if (remainingText) {
    result.textQuery = remainingText;
  }

  return result;
}

/**
 * Convert parsed query to Discover API parameters
 */
export function toDiscoverParams(parsed: ParsedSearchQuery): DiscoverMovieParams {
  const params: DiscoverMovieParams = {};

  if (parsed.year) {
    params.primary_release_year = parsed.year;
  }

  if (parsed.minRating !== undefined) {
    params['vote_average.gte'] = parsed.minRating;
    // Ensure minimum vote count for reliable ratings
    params['vote_count.gte'] = 100;
  }

  if (parsed.maxRating !== undefined) {
    params['vote_average.lte'] = parsed.maxRating;
  }

  if (parsed.genres && parsed.genres.length > 0) {
    params.with_genres = parsed.genres.join(',');
  }

  if (parsed.minRuntime !== undefined) {
    params['with_runtime.gte'] = parsed.minRuntime;
  }

  if (parsed.maxRuntime !== undefined) {
    params['with_runtime.lte'] = parsed.maxRuntime;
  }

  // Default sorting: by popularity descending
  params.sort_by = 'popularity.desc';

  return params;
}

/**
 * Get human-readable description of parsed query
 * Useful for debugging and user feedback
 */
export function getQueryDescription(parsed: ParsedSearchQuery): string {
  const parts: string[] = [];

  if (parsed.textQuery) {
    parts.push(`"${parsed.textQuery}"`);
  }

  if (parsed.year) {
    parts.push(`from ${parsed.year}`);
  }

  if (parsed.genres && parsed.genres.length > 0) {
    parts.push(`genre: ${parsed.genres.join(', ')}`);
  }

  if (parsed.minRating !== undefined) {
    parts.push(`rating ≥ ${parsed.minRating}`);
  }

  if (parsed.maxRating !== undefined) {
    parts.push(`rating ≤ ${parsed.maxRating}`);
  }

  if (parsed.minRuntime !== undefined) {
    parts.push(`runtime ≥ ${parsed.minRuntime} min`);
  }

  return parts.length > 0 ? parts.join(', ') : 'All movies';
}
