import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { MovieSearchResponse } from '../types/movie.types';
import { API_CONFIG } from '../config/api.config';



export const tmdbApi = createApi({
  reducerPath: 'tmdbApi',
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.TMDB_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('Accept', 'application/json');
      return headers;
    },
  }),
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
  }),
});

export const { useSearchMoviesQuery, useGetPopularMoviesQuery } = tmdbApi;

// Helper function to get image URL
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
  if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
  return `${API_CONFIG.TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
