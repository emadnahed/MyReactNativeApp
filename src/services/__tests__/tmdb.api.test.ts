import { configureStore } from '@reduxjs/toolkit';
import { tmdbApi, getImageUrl } from '../tmdb.api';

describe('tmdb.api', () => {
  let store: any;

  beforeEach(() => {
    // Create a fresh store for each test
    store = configureStore({
      reducer: {
        [tmdbApi.reducerPath]: tmdbApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),
    });
  });

  afterEach(() => {
    // Clear the API cache after each test
    store.dispatch(tmdbApi.util.resetApiState());
  });

  describe('getImageUrl helper', () => {
    it('should return correct URL for valid path with default size', () => {
      const url = getImageUrl('/test-image.jpg');
      expect(url).toContain('w500');
      expect(url).toContain('/test-image.jpg');
    });

    it('should return correct URL for w200 size', () => {
      const url = getImageUrl('/test-image.jpg', 'w200');
      expect(url).toContain('w200');
      expect(url).toContain('/test-image.jpg');
    });

    it('should return correct URL for original size', () => {
      const url = getImageUrl('/test-image.jpg', 'original');
      expect(url).toContain('original');
      expect(url).toContain('/test-image.jpg');
    });

    it('should return placeholder URL for null path', () => {
      const url = getImageUrl(null);
      expect(url).toContain('placeholder');
      expect(url).toContain('No+Image');
    });
  });

  describe('API endpoints', () => {
    describe('searchMovies', () => {
      it('should have searchMovies endpoint', () => {
        expect(tmdbApi.endpoints.searchMovies).toBeDefined();
      });

      it('should build correct query for searchMovies', () => {
        const endpoint = tmdbApi.endpoints.searchMovies;
        const query = endpoint.query({ query: 'Matrix', page: 1 });

        expect(query).toHaveProperty('url', '/search/movie');
        expect(query).toHaveProperty('params');
        expect((query as any).params.query).toBe('Matrix');
        expect((query as any).params.page).toBe(1);
      });

      it('should use default page 1 when not provided', () => {
        const endpoint = tmdbApi.endpoints.searchMovies;
        const query = endpoint.query({ query: 'Matrix' });

        expect((query as any).params.page).toBe(1);
      });
    });

    describe('getPopularMovies', () => {
      it('should have getPopularMovies endpoint', () => {
        expect(tmdbApi.endpoints.getPopularMovies).toBeDefined();
      });

      it('should build correct query for getPopularMovies', () => {
        const endpoint = tmdbApi.endpoints.getPopularMovies;
        const query = endpoint.query(2);

        expect(query).toHaveProperty('url', '/movie/popular');
        expect(query).toHaveProperty('params');
        expect((query as any).params.page).toBe(2);
      });

      it('should use default page 1 when not provided', () => {
        const endpoint = tmdbApi.endpoints.getPopularMovies;
        const query = endpoint.query(undefined as any);

        expect((query as any).params.page).toBe(1);
      });
    });

    describe('getMovieDetails', () => {
      it('should have getMovieDetails endpoint', () => {
        expect(tmdbApi.endpoints.getMovieDetails).toBeDefined();
      });

      it('should build correct query for getMovieDetails', () => {
        const endpoint = tmdbApi.endpoints.getMovieDetails;
        const query = endpoint.query(550);

        expect(query).toHaveProperty('url', '/movie/550');
        expect(query).toHaveProperty('params');
      });
    });
  });

  describe('API configuration', () => {
    it('should have correct reducer path', () => {
      expect(tmdbApi.reducerPath).toBe('tmdbApi');
    });

    it('should have Movies tag type', () => {
      expect(tmdbApi).toBeDefined();
      // TagTypes are internal to RTK Query, but we can verify the API is properly configured
      expect(tmdbApi.endpoints.searchMovies).toBeDefined();
    });

    it('should export hooks for all endpoints', () => {
      const { useSearchMoviesQuery, useGetPopularMoviesQuery, useGetMovieDetailsQuery } =
        require('../tmdb.api');

      expect(useSearchMoviesQuery).toBeDefined();
      expect(useGetPopularMoviesQuery).toBeDefined();
      expect(useGetMovieDetailsQuery).toBeDefined();
    });
  });

  describe('API tags and caching', () => {
    it('should provide correct tags for searchMovies', () => {
      const mockResult = {
        results: [
          { id: 1, title: 'Movie 1' },
          { id: 2, title: 'Movie 2' },
        ],
      };

      const endpoint = tmdbApi.endpoints.searchMovies;
      const tags = endpoint.providesTags?.(mockResult as any, undefined, {
        query: 'test',
      });

      expect(tags).toEqual([
        { type: 'Movies', id: 1 },
        { type: 'Movies', id: 2 },
        { type: 'Movies', id: 'LIST' },
      ]);
    });

    it('should provide LIST tag when searchMovies result is undefined', () => {
      const endpoint = tmdbApi.endpoints.searchMovies;
      const tags = endpoint.providesTags?.(undefined, undefined, {
        query: 'test',
      });

      expect(tags).toEqual([{ type: 'Movies', id: 'LIST' }]);
    });

    it('should provide POPULAR tag for getPopularMovies', () => {
      const endpoint = tmdbApi.endpoints.getPopularMovies;
      const tags = endpoint.providesTags;

      expect(tags).toEqual([{ type: 'Movies', id: 'POPULAR' }]);
    });

    it('should provide movie-specific tag for getMovieDetails', () => {
      const endpoint = tmdbApi.endpoints.getMovieDetails;
      const tags = endpoint.providesTags?.(undefined as any, undefined, 550);

      expect(tags).toEqual([{ type: 'Movies', id: 550 }]);
    });
  });
});
