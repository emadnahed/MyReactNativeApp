import { configureStore } from '@reduxjs/toolkit';
import movieReducer, {
  setCurrentMovieTitle,
  clearCurrentMovieTitle,
} from '../../store/movieSlice';
import { tmdbApi } from '../../services/tmdb.api';

describe('Redux + API Integration', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        movie: movieReducer,
        [tmdbApi.reducerPath]: tmdbApi.reducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(tmdbApi.middleware),
    });
  });

  afterEach(() => {
    // Clean up the store
    store.dispatch(tmdbApi.util.resetApiState());
  });

  describe('Movie State Management', () => {
    it('should have initial state', () => {
      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBeNull();
    });

    it('should update movie title through Redux action', () => {
      store.dispatch(setCurrentMovieTitle('Inception'));
      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('Inception');
    });

    it('should clear movie title', () => {
      store.dispatch(setCurrentMovieTitle('The Matrix'));
      store.dispatch(clearCurrentMovieTitle());
      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBeNull();
    });

    it('should handle multiple title updates', () => {
      store.dispatch(setCurrentMovieTitle('Movie 1'));
      expect(store.getState().movie.currentMovieTitle).toBe('Movie 1');

      store.dispatch(setCurrentMovieTitle('Movie 2'));
      expect(store.getState().movie.currentMovieTitle).toBe('Movie 2');

      store.dispatch(setCurrentMovieTitle('Movie 3'));
      expect(store.getState().movie.currentMovieTitle).toBe('Movie 3');
    });
  });

  describe('RTK Query Integration', () => {
    it('should have API reducer in state', () => {
      const state = store.getState();
      expect(state[tmdbApi.reducerPath]).toBeDefined();
    });

    it('should initialize with empty queries', () => {
      const state = store.getState();
      const apiState = state[tmdbApi.reducerPath];
      expect(apiState.queries).toBeDefined();
      expect(Object.keys(apiState.queries)).toHaveLength(0);
    });

    it('should reset API state', () => {
      store.dispatch(setCurrentMovieTitle('Test Movie'));
      store.dispatch(tmdbApi.util.resetApiState());

      const state = store.getState();
      const apiState = state[tmdbApi.reducerPath];

      expect(Object.keys(apiState.queries)).toHaveLength(0);
      expect(Object.keys(apiState.mutations)).toHaveLength(0);
    });
  });

  describe('Store Configuration', () => {
    it('should have correct middleware setup', () => {
      // The store should be able to handle async actions
      expect(() => {
        store.dispatch(setCurrentMovieTitle('Test'));
      }).not.toThrow();
    });

    it('should maintain state immutability', () => {
      const initialState = store.getState();
      store.dispatch(setCurrentMovieTitle('New Title'));
      const newState = store.getState();

      // States should be different objects
      expect(initialState).not.toBe(newState);
      expect(initialState.movie).not.toBe(newState.movie);
    });

    it('should handle rapid state updates', () => {
      for (let i = 0; i < 100; i++) {
        store.dispatch(setCurrentMovieTitle(`Movie ${i}`));
      }

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('Movie 99');
    });
  });

  describe('State Selectors', () => {
    it('should be able to select movie state', () => {
      store.dispatch(setCurrentMovieTitle('Selected Movie'));

      const state = store.getState();
      const movieState = state.movie;

      expect(movieState).toBeDefined();
      expect(movieState.currentMovieTitle).toBe('Selected Movie');
    });

    it('should be able to select API state', () => {
      const state = store.getState();
      const apiState = state[tmdbApi.reducerPath];

      expect(apiState).toBeDefined();
      expect(apiState.queries).toBeDefined();
      expect(apiState.mutations).toBeDefined();
      expect(apiState.subscriptions).toBeDefined();
    });
  });

  describe('Action Dispatching', () => {
    it('should dispatch multiple actions in sequence', () => {
      store.dispatch(setCurrentMovieTitle('Movie A'));
      store.dispatch(clearCurrentMovieTitle());
      store.dispatch(setCurrentMovieTitle('Movie B'));

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('Movie B');
    });

    it('should handle action with empty string', () => {
      store.dispatch(setCurrentMovieTitle(''));

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe('');
    });

    it('should handle action with special characters', () => {
      const specialTitle = 'Movie: 2049 (Director\'s Cut) [4K]';
      store.dispatch(setCurrentMovieTitle(specialTitle));

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe(specialTitle);
    });

    it('should handle very long titles', () => {
      const longTitle = 'A'.repeat(1000);
      store.dispatch(setCurrentMovieTitle(longTitle));

      const state = store.getState();
      expect(state.movie.currentMovieTitle).toBe(longTitle);
      expect(state.movie.currentMovieTitle.length).toBe(1000);
    });
  });
});
