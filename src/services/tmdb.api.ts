import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MovieSearchResponse, MovieDetails } from '../types/movie.types';
import type { DiscoverMovieParams } from '../types/discover.types';
import { API_CONFIG } from '../config/api.config';


// Helper function to convert request to cURL command
const generateCurlCommand = (url: string, options: RequestInit = {}): string => {
  const { method = 'GET', headers = {}, body } = options;

  let curl = `curl -X ${method} "${url}"`;

  // Add headers
  Object.entries(headers).forEach(([key, value]) => {
    curl += ` -H "${key}: ${value}"`;
  });

  // Add body for POST/PUT requests
  if (body && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    curl += ` -d '${typeof body === 'string' ? body : JSON.stringify(body)}'`;
  }

  return curl;
};

// Custom base query with cURL logging
const baseQueryWithLogging = fetchBaseQuery({
  baseUrl: API_CONFIG.TMDB_BASE_URL,
  prepareHeaders: (headers) => {
    headers.set('Accept', 'application/json');
    return headers;
  },
});

// Wrapper to add logging
const loggedBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const result = await baseQueryWithLogging(args, api, extraOptions);

  // Log the cURL command for the request
  if (typeof args === 'string') {
    // Simple string URL
    console.log('🌐 API Request:', generateCurlCommand(`${API_CONFIG.TMDB_BASE_URL}${args}`));
  } else if (args && typeof args === 'object') {
    // Object with url and other options
    const { url, method = 'GET', headers = {}, body, params } = args;

    // Build full URL with params
    let fullUrl = `${API_CONFIG.TMDB_BASE_URL}${url}`;
    if (params) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (queryString) {
        fullUrl += `?${queryString}`;
      }
    }

    // Prepare headers for cURL
    const requestHeaders: Record<string, string> = {
      'Accept': 'application/json',
      ...Object.fromEntries(headers.entries?.() || []),
    };

    // Prepare body for cURL
    let requestBody = body;
    if (body && typeof body === 'object') {
      requestBody = JSON.stringify(body);
      requestHeaders['Content-Type'] = 'application/json';
    }

    console.log('🌐 API Request:', generateCurlCommand(fullUrl, {
      method,
      headers: requestHeaders,
      body: requestBody,
    }));
  }

  return result;
};

export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: loggedBaseQuery,
  tagTypes: ['Movies'],
  endpoints: (builder) => ({
    searchMovies: builder.query<MovieSearchResponse, { query: string; page?: number }>({
      query: ({ query, page = 1 }) => ({
        url: '/search/movie',
        params: {
          api_key: API_CONFIG.TMDB_API_KEY,
          query,
          page,
          include_adult: false,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Movies' as const, id })),
              { type: 'Movies', id: 'LIST' },
            ]
          : [{ type: 'Movies', id: 'LIST' }],
    }),
    getPopularMovies: builder.query<MovieSearchResponse, number>({
      query: (page = 1) => ({
        url: '/movie/popular',
        params: {
          api_key: API_CONFIG.TMDB_API_KEY,
          page,
        },
      }),
      providesTags: [{ type: 'Movies', id: 'POPULAR' }],
    }),
    getMovieDetails: builder.query<MovieDetails, number>({
      query: (movieId) => ({
        url: `/movie/${movieId}`,
        params: {
          api_key: API_CONFIG.TMDB_API_KEY,
        },
      }),
      providesTags: (_result, _error, id) => [{ type: 'Movies', id }],
    }),
    discoverMovies: builder.query<MovieSearchResponse, DiscoverMovieParams>({
      query: (params) => ({
        url: '/discover/movie',
        params: {
          api_key: API_CONFIG.TMDB_API_KEY,
          include_adult: false,
          ...params,
        },
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.results.map(({ id }) => ({ type: 'Movies' as const, id })),
              { type: 'Movies', id: 'DISCOVER' },
            ]
          : [{ type: 'Movies', id: 'DISCOVER' }],
    }),
  }),
});

export const {
  useSearchMoviesQuery,
  useGetPopularMoviesQuery,
  useGetMovieDetailsQuery,
  useDiscoverMoviesQuery,
} = tmdbApi;

// Helper function to get image URL
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
