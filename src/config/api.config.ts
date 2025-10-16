/**
 * API Configuration
 *
 * For production apps, consider using:
 * - react-native-config for environment variables
 * - react-native-dotenv for .env file support
 */

export const API_CONFIG = {
  TMDB_API_KEY: process.env.TMDB_API_KEY || '',
  TMDB_BASE_URL: process.env.TMDB_BASE_URL || '',
  TMDB_IMAGE_BASE_URL: process.env.TMDB_IMAGE_BASE_URL || '',
};
