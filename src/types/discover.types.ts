/**
 * TMDb Discover API Types
 *
 * Type definitions for the TMDb Discover API parameters and responses.
 * Discover API allows advanced filtering by genre, year, rating, and more.
 */

/**
 * Discover API Parameters
 * All parameters are optional and can be combined for advanced filtering.
 */
export interface DiscoverMovieParams {
  // Pagination
  page?: number;

  // Release Date Filters
  primary_release_year?: number; // e.g., 2020
  'primary_release_date.gte'?: string; // Format: YYYY-MM-DD
  'primary_release_date.lte'?: string; // Format: YYYY-MM-DD
  year?: number; // Any release year

  // Rating Filters
  'vote_average.gte'?: number; // Minimum rating (0-10)
  'vote_average.lte'?: number; // Maximum rating (0-10)
  'vote_count.gte'?: number; // Minimum vote count

  // Genre Filters
  with_genres?: string; // Comma-separated genre IDs (e.g., "28,12")
  without_genres?: string; // Exclude genres

  // Sorting
  sort_by?:
    | 'popularity.desc'
    | 'popularity.asc'
    | 'release_date.desc'
    | 'release_date.asc'
    | 'revenue.desc'
    | 'revenue.asc'
    | 'primary_release_date.desc'
    | 'primary_release_date.asc'
    | 'original_title.desc'
    | 'original_title.asc'
    | 'vote_average.desc'
    | 'vote_average.asc'
    | 'vote_count.desc'
    | 'vote_count.asc';

  // Runtime Filters
  'with_runtime.gte'?: number; // Minimum runtime in minutes
  'with_runtime.lte'?: number; // Maximum runtime in minutes

  // Language
  with_original_language?: string; // ISO 639-1 code (e.g., 'en')

  // Certification
  certification_country?: string; // ISO 3166-1 code (e.g., 'US')
  certification?: string; // e.g., 'R', 'PG-13'
  'certification.gte'?: string;
  'certification.lte'?: string;

  // Keywords
  with_keywords?: string; // Comma-separated keyword IDs
  without_keywords?: string;

  // Cast and Crew
  with_cast?: string; // Comma-separated person IDs
  with_crew?: string;
  with_people?: string;

  // Companies
  with_companies?: string; // Comma-separated company IDs

  // Watch Providers
  with_watch_providers?: string; // Comma-separated provider IDs
  watch_region?: string; // ISO 3166-1 code

  // Other
  include_adult?: boolean;
  include_video?: boolean;
  region?: string;
}

/**
 * Parsed Search Query
 * Result of parsing user input into structured filters
 */
export interface ParsedSearchQuery {
  // Original query text (for title search)
  textQuery?: string;

  // Extracted filters
  year?: number;
  minRating?: number;
  maxRating?: number;
  genres?: string[]; // Genre IDs
  minRuntime?: number;
  maxRuntime?: number;

  // Flags
  useDiscover: boolean; // Whether to use Discover API
}

/**
 * Genre Mapping
 * Maps genre names/keywords to TMDb genre IDs
 */
export interface GenreInfo {
  id: number;
  name: string;
  keywords: string[]; // Alternative names/keywords
}
