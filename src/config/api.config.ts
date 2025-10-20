/**
 * API Configuration
 *
 * Uses react-native-config for environment variables.
 * Variables are loaded from .env.development or .env.production
 * based on the ENVFILE environment variable set in package.json scripts.
 */

import Config from 'react-native-config';

export const API_CONFIG = {
  TMDB_API_KEY: Config.TMDB_API_KEY || '',
  TMDB_BASE_URL: Config.TMDB_BASE_URL || 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE_URL: Config.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p',
  ENV: Config.ENV || 'development',
} as const;
